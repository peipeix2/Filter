import { useState, useEffect } from 'react'
import useUserStore from '../../store/userStore'
import { Avatar, Button } from '@nextui-org/react'
import { Link, Outlet, useParams } from 'react-router-dom'
import { db } from '../../../firebase'
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  QuerySnapshot,
} from 'firebase/firestore'
import { useLocation } from 'react-router-dom'
import { Skeleton, Spinner } from '@nextui-org/react'
import {
  UserProfileState,
  FollowUserState,
  CommentState,
  ReviewState,
} from '../../utils/type'

const Profile = () => {
  const [profileUser, setProfileUser] = useState<UserProfileState | null>(null)
  const [isFollowing, setIsFollowing] = useState<boolean>(false)
  const [followersCount, setFollowersCount] = useState<number>(0)
  const [followingCount, setFollowingCount] = useState<number>(0)
  const [isHoverBtn, setIsHoverBtn] = useState<boolean>(false)
  const {
    user,
    userMoviesComments,
    userMoviesReviews,
    setUserFollowings,
    setUserFollowers,
    isLogin,
    setUserMoviesComments,
    setUserMoviesReviews,
  } = useUserStore()
  const { userId } = useParams()

  useEffect(() => {
    if (!userId) return

    const docRef = doc(db, 'USERS', userId)
    const unsubs = onSnapshot(docRef, (doc) => {
      const profileData = doc.data()
      setProfileUser(profileData as UserProfileState)
    })

    return () => {
      unsubs()
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return

    const profileUserFollowerRef = collection(db, 'USERS', userId, 'FOLLOWER')
    const profileUserFollowingRef = collection(db, 'USERS', userId, 'FOLLOWING')

    const unsubs = onSnapshot(
      profileUserFollowerRef,
      (querySnapshot: QuerySnapshot) => {
        setFollowersCount(querySnapshot.size)
        const currentFollowers: FollowUserState[] = []
        querySnapshot.forEach((doc) => {
          currentFollowers.push(doc.data() as FollowUserState)
        })
        setIsFollowing(
          currentFollowers.some((follower) => follower.userId === user.userId)
        )
        setUserFollowers(currentFollowers)
      }
    )

    const unsubsFollowing = onSnapshot(
      profileUserFollowingRef,
      (querySnapshot: QuerySnapshot) => {
        setFollowingCount(querySnapshot.size)
        const currentFollowings: FollowUserState[] = []
        if (querySnapshot)
          querySnapshot.forEach((doc) => {
            currentFollowings.push(doc.data() as FollowUserState)
          })
        setUserFollowings(currentFollowings)
      }
    )

    return () => {
      unsubs()
      unsubsFollowing()
    }
  }, [user.userId])

  useEffect(() => {
    if (!userId) return
    const commentDocRef = collection(db, 'USERS', userId, 'COMMENTS')
    const reviewDocRef = collection(db, 'USERS', userId, 'REVIEWS')

    const unsubscribeComments = onSnapshot(commentDocRef, (querySnapshot) => {
      const comments: CommentState[] = []
      querySnapshot.forEach((doc) => {
        const commentsData = doc.data()
        const commentsWithId = { ...commentsData, id: doc.id }
        comments.push(commentsWithId as CommentState)
      })
      setUserMoviesComments(comments)
    })

    const unsubscribeReviews = onSnapshot(reviewDocRef, (querySnapshot) => {
      const reviews: ReviewState[] = []
      querySnapshot.forEach((doc) => {
        const reviewsData = doc.data()
        const reviewsWithId = { ...reviewsData, id: doc.id }
        reviews.push(reviewsWithId as ReviewState)
      })
      setUserMoviesReviews(reviews)
    })

    return () => {
      unsubscribeComments()
      unsubscribeReviews()
    }
  }, [userId])

  const location = useLocation()
  const isCurrentUser = userId === user.userId

  if (!profileUser) {
    return <Spinner className="my-5 h-40 w-full" color="default" />
  }

  if (!userId) return

  const handleFollowUser = async (
    profileUserId: string,
    currentUserId: string
  ) => {
    const currentUserRef = doc(
      db,
      'USERS',
      currentUserId,
      'FOLLOWING',
      profileUserId
    )
    const profileUserRef = doc(
      db,
      'USERS',
      profileUserId,
      'FOLLOWER',
      currentUserId
    )

    if (isFollowing) {
      await deleteDoc(currentUserRef)
      await deleteDoc(profileUserRef)
    } else {
      await setDoc(currentUserRef, {
        userId: userId,
        username: profileUser.username,
        avatar: profileUser.avatar,
      })

      await setDoc(profileUserRef, {
        userId: user.userId,
        username: user.username,
        avatar: user.avatar,
      })
    }
    setIsFollowing(!isFollowing)
  }

  const profileTabLinks = [
    {
      name: '用戶動態',
      link: './discover',
      linkName: 'discover',
      description: '查看追蹤用戶的所有評論',
    },
    {
      name: '我的影評',
      link: './activity',
      linkName: 'activity',
      description: '你的觀影紀錄、影評',
    },
    {
      name: '追蹤列表',
      link: './network',
      linkName: 'network',
      description: '訂閱及粉絲追蹤狀態',
    },
    {
      name: '點讚',
      link: './likes',
      linkName: 'likes',
      description: '過往曾經的按讚',
    },
    {
      name: '收藏',
      link: './calendar',
      linkName: 'calendar',
      description: '收藏影片與觀影計畫',
    },
    {
      name: '設定',
      link: './setting',
      linkName: 'setting',
      description: '更改頭像及封面圖片',
    },
  ]

  const userData = [
    { title: '評論', content: userMoviesComments.length },
    { title: '影評', content: userMoviesReviews.length },
    { title: '追蹤', content: followingCount },
    { title: '粉絲', content: followersCount },
  ]

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${profileUser.backdrop})`,
        }}
        className="h-[150px] w-full bg-cover bg-scroll bg-center bg-no-repeat lg:h-[500px] lg:bg-cover"
      />
      <section className="profile mx-auto mt-10 flex w-4/5 flex-col">
        <div className="header flex w-full flex-col items-center justify-between gap-5 lg:flex-row">
          <div className="profile flex flex-col items-center gap-2 lg:flex-row">
            <div className="profile-info flex items-center">
              <Avatar src={profileUser.avatar} size="lg" />
              <p className="ml-3 text-lg font-extrabold md:text-2xl">
                {profileUser.username}
              </p>
            </div>
            {!isCurrentUser && isLogin && (
              <Button
                size="sm"
                variant="shadow"
                className={`ml-5 ${
                  isFollowing
                    ? isHoverBtn
                      ? 'bg-[#bf2e5c] tracking-wider text-white'
                      : 'bg-[#89a9a6] tracking-wider text-white'
                    : 'bg-[#f46854] tracking-wider text-white'
                }`}
                onClick={() => handleFollowUser(userId, user.userId)}
                onMouseEnter={() => setIsHoverBtn(true)}
                onMouseLeave={() => setIsHoverBtn(false)}
              >
                {isFollowing ? (isHoverBtn ? '取消追蹤' : '追蹤中') : '追蹤'}
              </Button>
            )}
          </div>

          <div className="follows-data flex gap-8">
            {userData.map((item, index) => {
              return (
                <div
                  className="comments-count flex flex-col items-center"
                  key={index}
                >
                  <span className="text-xs text-slate-300 md:text-sm">
                    {item.title}
                  </span>
                  <span className="text-xl font-extrabold text-[#89a9a6] md:text-2xl">
                    {item.content}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="tab mx-auto mb-5 mt-10 flex w-full justify-evenly md:mt-20 md:w-1/2">
          {profileTabLinks.map((tab, index) => {
            return (
              <Link
                to={tab.link}
                key={index}
                className={`pb-2 font-['DM_Serif_Display'] text-sm tracking-wide hover:border-b-4 hover:border-[#89a9a6] hover:font-extrabold hover:text-[#89a9a6] md:text-base ${
                  location.pathname?.includes(tab.linkName)
                    ? 'border-b-4 border-[#89a9a6] font-extrabold text-[#89a9a6]'
                    : 'border-b-4 border-transparent font-extrabold text-slate-300'
                }`}
              >
                {tab.name}
              </Link>
            )
          })}
        </div>

        <div className="mx-auto mt-20 w-full md:w-3/5">
          <Outlet />
        </div>
      </section>
    </>
  )
}

export default Profile

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
import { Skeleton } from '@nextui-org/react'

interface UserState {
  userId: string
  username: string | undefined | null
  email: string | undefined | null
  avatar: string
}

const Profile = () => {
  const [profileUser, setProfileUser] = useState<any>(null)
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
  } = useUserStore()
  const { userId } = useParams()
  let profileUserFollowerRef: any
  let profileUserFollowingRef: any
  let docRef: any

  useEffect(() => {
    if (userId) {
      docRef = doc(db, 'USERS', userId)
    }

    const unsubs = onSnapshot(docRef, (doc: any) => {
      const profileData = doc.data()
      setProfileUser(profileData)
    })

    return () => {
      unsubs()
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      profileUserFollowerRef = collection(db, 'USERS', userId, 'FOLLOWER')
      profileUserFollowingRef = collection(db, 'USERS', userId, 'FOLLOWING')
    }

    const unsubs = onSnapshot(
      profileUserFollowerRef,
      (querySnapshot: QuerySnapshot) => {
        setFollowersCount(querySnapshot.size)
        const currentFollowers: any = []
        querySnapshot.forEach((doc) => {
          const data = doc.data() as UserState
          currentFollowers.push(data)
        })
        setIsFollowing(
          currentFollowers.some(
            (follower: UserState) => follower.userId === user.userId
          )
        )
        setUserFollowers(currentFollowers)
      }
    )

    const unsubsFollowing = onSnapshot(
      profileUserFollowingRef,
      (querySnapshot: QuerySnapshot) => {
        setFollowingCount(querySnapshot.size)
        const currentFollowings: any = []
        if (querySnapshot)
          querySnapshot.forEach((doc) => {
            currentFollowings.push(doc.data())
          })
        setUserFollowings(currentFollowings)
      }
    )

    return () => {
      unsubs()
      unsubsFollowing()
    }
  }, [user.userId])

  const location = useLocation()

  if (!profileUser) {
    return (
      <div>
        <Skeleton className="w-100% h-[500px]"></Skeleton>
        <Skeleton className="profile mx-auto mt-10 flex w-4/5 flex-col">
          <Skeleton className="header flex w-full items-center justify-between">
            <Skeleton className="profile flex items-center">
              <Avatar size="lg" />
              <Skeleton className="ml-3 h-4 w-1/5"></Skeleton>
            </Skeleton>
          </Skeleton>
        </Skeleton>
      </div>
    )
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
    { name: '動態', link: './discover', linkName: 'discover' },
    { name: '筆記', link: './activity', linkName: 'activity' },
    { name: '追蹤列表', link: './network', linkName: 'network' },
    { name: '點讚', link: './likes', linkName: 'likes' },
    { name: '日曆', link: './calendar', linkName: 'calendar' },
    { name: '設定', link: './setting', linkName: 'setting' },
  ]

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${profileUser.backdrop})`,
        }}
        className="w-100% h-[500px] bg-cover bg-fixed bg-center bg-no-repeat"
      />
      <section className="profile mx-auto mt-10 flex w-4/5 flex-col">
        <div className="header flex w-full items-center justify-between">
          <div className="profile flex items-center">
            <div className="profile-info flex items-center">
              <Avatar src={profileUser.avatar} size="lg" />
              <p className="ml-3 text-2xl font-extrabold">
                {profileUser.username}
              </p>
            </div>
            {userId !== user.userId && isLogin && (
              <Button
                size="sm"
                className="ml-5"
                color={
                  isFollowing ? (isHoverBtn ? 'danger' : 'success') : 'primary'
                }
                onClick={() => handleFollowUser(userId, user.userId)}
                onMouseEnter={() => setIsHoverBtn(true)}
                onMouseLeave={() => setIsHoverBtn(false)}
              >
                {isFollowing ? (isHoverBtn ? '取消追蹤' : '追蹤中') : '追蹤'}
              </Button>
            )}
          </div>

          <div className="follows-data flex gap-2">
            <div className="comments-count flex flex-col items-center">
              <span className="text-sm text-slate-300">評論數</span>
              <span className="text-2xl font-extrabold text-[#89a9a6]">
                {userMoviesComments && userMoviesComments.length}
              </span>
            </div>
            <div className="reviews-count flex flex-col items-center">
              <span className="text-sm text-slate-300">影評數</span>
              <span className="text-2xl font-extrabold text-[#89a9a6]">
                {userMoviesReviews && userMoviesReviews.length}
              </span>
            </div>
            <div className="followers-count flex flex-col items-center">
              <span className="text-sm text-slate-300">追蹤人數</span>
              <span className="text-2xl font-extrabold text-[#89a9a6]">
                {followingCount}
              </span>
            </div>
            <div className="following-count flex flex-col items-center">
              <span className="text-sm text-slate-300">粉絲人數</span>
              <span className="text-2xl font-extrabold text-[#89a9a6]">
                {followersCount}
              </span>
            </div>
          </div>
        </div>

        <div className="tab mx-auto mb-5 mt-20 flex w-1/2 justify-evenly">
          {profileTabLinks.map((tab, index) => {
            return (
              <Link
                to={tab.link}
                key={index}
                className={`text-md pb-2 font-['DM_Serif_Display'] tracking-wide hover:border-b-4 hover:border-[#89a9a6] hover:font-extrabold hover:text-[#89a9a6] ${
                  location.pathname?.includes(tab.linkName)
                    ? 'border-b-4 border-[#89a9a6] font-extrabold text-[#89a9a6]'
                    : 'font-extrabold text-slate-300'
                }`}
              >
                {tab.name}
              </Link>
            )
          })}
        </div>

        {/* <Divider className="mx-auto w-1/2" /> */}

        <div className="mx-auto mt-20 w-3/5">
          <Outlet />
        </div>
      </section>
    </>
  )
}

export default Profile

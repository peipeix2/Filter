import { useState, useEffect } from 'react'
import useUserStore from '../../store/userStore'
import { Avatar, Divider, Button } from '@nextui-org/react'
import { Link, Outlet, useParams } from 'react-router-dom'
import { db } from '../../../firebase'
import { collection, getDoc, doc, setDoc, onSnapshot, deleteDoc, QuerySnapshot } from 'firebase/firestore'

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
  const { user, userMoviesComments, userMoviesReviews, setUserFollowings, setUserFollowers, isLogin } = useUserStore()
  const { userId } = useParams()
  let profileUserFollowerRef: any
  let profileUserFollowingRef: any

  useEffect(() => {
    if (userId) {
      fetchUser(userId)
      profileUserFollowerRef = collection(db, 'USERS', userId, 'FOLLOWER')
      profileUserFollowingRef = collection(db, 'USERS', userId, 'FOLLOWING')
    }
    console.log('userId', userId)

    const unsubs = onSnapshot(profileUserFollowerRef, (querySnapshot:QuerySnapshot) => {
      setFollowersCount(querySnapshot.size)
      const currentFollowers:any = []
      querySnapshot.forEach(doc => {
        const data = doc.data() as UserState
        currentFollowers.push(data)
      })
      setIsFollowing(currentFollowers.some((follower:UserState) => follower.userId === user.userId))
      setUserFollowers(currentFollowers)
    })

    const unsubsFollowing = onSnapshot(profileUserFollowingRef,(querySnapshot:QuerySnapshot) => {
      setFollowingCount(querySnapshot.size)
      const currentFollowings: any = []
      if (querySnapshot)
      querySnapshot.forEach(doc => {
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

  const fetchUser = async (userId: string) => {
    const docRef = doc(db, 'USERS', userId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setProfileUser(docSnap.data())
    }
  }

  if (!profileUser) return
  // if (!user.userId) return
  if (!userId) return

  const handleFollowUser = async (profileUserId: string, currentUserId:string) => {
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

    if(isFollowing) {
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
    { name: '動態', link: './discover' },
    { name: '筆記', link: './activity' },
    { name: '追蹤列表', link: './network' },
    { name: '點讚', link: './likes' },
    { name: '日曆', link: './calender' },
    { name: '設定', link: './setting' },
  ]

  return (
    <>
      <div
        style={{
          backgroundImage: `url('https://image.tmdb.org/t/p/original/mRmRE4RknbL7qKALWQDz64hWKPa.jpg')`,
        }}
        className="w-100% h-[500px] bg-cover bg-center bg-no-repeat"
      />
      <section className="profile mx-auto mt-10 flex w-4/5 flex-col">
        <div className="header flex w-full items-center justify-between">
          <div className="profile flex items-center">
            <div className="profile-info flex items-baseline">
              <Avatar src={profileUser.avatar} size="lg" />
              <p>{profileUser.username}</p>
            </div>
            {userId !== user.userId && isLogin && (
              <Button
                size="sm"
                className="ml-5"
                color={isFollowing ? (isHoverBtn ? 'danger' : 'success') : 'primary'}
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
              <span>評論數</span>
              <span>{userMoviesComments && userMoviesComments.length}</span>
            </div>
            <div className="reviews-count flex flex-col items-center">
              <span>影評數</span>
              <span>{userMoviesReviews && userMoviesReviews.length}</span>
            </div>
            <div className="followers-count flex flex-col items-center">
              <span>追蹤人數</span>
              <span>{followingCount}</span>
            </div>
            <div className="following-count flex flex-col items-center">
              <span>粉絲人數</span>
              <span>{followersCount}</span>
            </div>
          </div>
        </div>

        <div className="tab mx-auto mb-5 mt-20 flex w-1/2 justify-evenly">
          {profileTabLinks.map((tab, index) => {
            return (
              <Link
                to={tab.link}
                key={index}
                className="text-md font-['DM_Serif_Display'] tracking-wide"
              >
                {tab.name}
              </Link>
            )
          })}
        </div>

        <Divider className="mx-auto w-1/2" />

        <div className="mx-auto mt-20 w-3/5">
          <Outlet />
        </div>
      </section>
    </>
  )
}

export default Profile

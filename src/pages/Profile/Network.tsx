import { useState, useEffect } from 'react'
import {
  collection,
  setDoc,
  onSnapshot,
  deleteDoc,
  doc,
  QuerySnapshot
} from 'firebase/firestore'
import { db } from '../../../firebase'
import { Avatar, Divider, Button } from '@nextui-org/react'
import useUserStore from '../../store/userStore'
import { useParams } from 'react-router-dom'

const Network = () => {
  const [followingUserIds, setFollowingUserIds] = useState<any>([])
  const [userHoverStates, setUserHoverState] = useState<any>({})
  const { user, userFollowers, userFollowings, isLogin } = useUserStore()
  const { userId } = useParams()
  let userFollowingRef: any

  useEffect(() => {
    if (user.userId) {
      console.log(!user.userId)
      userFollowingRef = collection(db, 'USERS', user.userId, 'FOLLOWING')
    } else {
      userFollowingRef = collection(db, 'USERS', 'guest', 'FOLLOWING')
    }

    const unsub = onSnapshot(userFollowingRef, (querySnapshot:QuerySnapshot) => {
      const followingIds: any = []
      querySnapshot.forEach((doc) => {
        followingIds.push(doc.id)
      })
      setFollowingUserIds(followingIds)
    })

    return () => {
      unsub()
    }
  }, [])

  const isUserFollowed = (userId: string) => {
    return followingUserIds.includes(userId)
  }

  const handleFollowUser = async (
    profileUserId: string,
    currentUserId: string,
    profileUser: any
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
    if (isUserFollowed(profileUserId)) {
      await deleteDoc(currentUserRef)
      await deleteDoc(profileUserRef)
    } else {
      await setDoc(currentUserRef, {
        userId: profileUser.userId,
        username: profileUser.username,
        avatar: profileUser.avatar,
      })

      await setDoc(profileUserRef, {
        userId: user.userId,
        username: user.username,
        avatar: user.avatar,
      })
    }
  }

  if (!userId) return

  return (
    <div>
      <div>
        <h1 className="mb-3">追蹤用戶</h1>
        <div className="user-data-panel min-h-[100px]">
          {userFollowings.map((profileUser) => {
            return (
              <>
                <div className="flex items-center justify-between">
                  <a
                    href={`/profile/${profileUser.userId}`}
                    className="user-card flex items-center p-2"
                  >
                    <Avatar src={profileUser.avatar} className="mr-2" />
                    <span>{profileUser.username}</span>
                  </a>
                  <div>
                    {user.userId !== profileUser.userId && isLogin && (
                      <Button
                        size="sm"
                        className="ml-5"
                        color={
                          isUserFollowed(profileUser.userId)
                            ? userHoverStates[profileUser.userId]
                              ? 'danger'
                              : 'success'
                            : 'primary'
                        }
                        onClick={() =>
                          handleFollowUser(profileUser.userId, user.userId, profileUser)
                        }
                        onMouseEnter={() =>
                          setUserHoverState((prev:any) => ({
                            ...prev,
                            [profileUser.userId]: true,
                          }))
                        }
                        onMouseLeave={() =>
                          setUserHoverState((prev:any) => ({
                            ...prev,
                            [profileUser.userId]: false,
                          }))
                        }
                      >
                        {isUserFollowed(profileUser.userId)
                          ? userHoverStates[profileUser.userId]
                            ? '取消追蹤'
                            : '追蹤中'
                          : '追蹤'}
                      </Button>
                    )}
                  </div>
                </div>
                <Divider />
              </>
            )
          })}
        </div>
      </div>
      <div>
        <h1 className="mb-3">粉絲</h1>
        <div className="user-data-panel min-h-[100px]">
          {userFollowers.map((profileUser) => {
            return (
              <>
                <div className="flex items-center justify-between">
                  <a
                    href={`/profile/${profileUser.userId}`}
                    className="user-card flex items-center p-2"
                  >
                    <Avatar src={profileUser.avatar} className="mr-2" />
                    <span>{profileUser.username}</span>
                  </a>

                  <div>
                    {user.userId !== profileUser.userId && isLogin && (
                      <Button
                        size="sm"
                        className="ml-5"
                        color={
                          isUserFollowed(profileUser.userId)
                            ? userHoverStates[profileUser.userId]
                              ? 'danger'
                              : 'success'
                            : 'primary'
                        }
                        onClick={() =>
                          handleFollowUser(
                            profileUser.userId,
                            user.userId,
                            profileUser
                          )
                        }
                        onMouseEnter={() =>
                          setUserHoverState((prev:any) => ({
                            ...prev,
                            [profileUser.userId]: true,
                          }))
                        }
                        onMouseLeave={() =>
                          setUserHoverState((prev:any) => ({
                            ...prev,
                            [profileUser.userId]: false,
                          }))
                        }
                      >
                        {isUserFollowed(profileUser.userId)
                          ? userHoverStates[profileUser.userId]
                            ? '取消追蹤'
                            : '追蹤中'
                          : '追蹤'}
                      </Button>
                    )}
                  </div>
                </div>
                <Divider />
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Network

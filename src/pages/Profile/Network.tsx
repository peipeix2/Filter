import { useState, useEffect } from 'react'
import {
  collection,
  setDoc,
  onSnapshot,
  deleteDoc,
  doc,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore'
import { db } from '../../../firebase'
import { Avatar, Divider, Button } from '@nextui-org/react'
import useUserStore from '../../store/userStore'
import { useParams } from 'react-router-dom'
import { Skeleton } from '@nextui-org/react'
import { FollowUserState } from '../../utils/type'

interface HoverState {
  [key: string]: boolean
}

const Network = () => {
  const [followingUserIds, setFollowingUserIds] = useState<string[]>([])
  const [userHoverStates, setUserHoverState] = useState<HoverState>({})
  const { user, userFollowers, userFollowings, isLogin } = useUserStore()
  const { userId } = useParams()
  let userFollowingRef: CollectionReference

  useEffect(() => {
    if (user.userId) {
      userFollowingRef = collection(db, 'USERS', user.userId, 'FOLLOWING')
    } else {
      userFollowingRef = collection(db, 'USERS', 'guest', 'FOLLOWING')
    }

    const unsub = onSnapshot(
      userFollowingRef,
      (querySnapshot: QuerySnapshot) => {
        const followingIds: string[] = []
        querySnapshot.forEach((doc) => {
          followingIds.push(doc.id)
        })
        setFollowingUserIds(followingIds)
      }
    )

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
    profileUser: FollowUserState
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
  if (!userFollowings) {
    return (
      <Skeleton className="flex w-5/12 items-center justify-between py-5"></Skeleton>
    )
  }
  if (!userFollowers) {
    return (
      <Skeleton className="flex w-5/12 items-center justify-between py-5"></Skeleton>
    )
  }

  return (
    <div className="page-container flex justify-between">
      <div className="following-section w-5/12">
        <h1 className="text-center text-base font-semibold text-[#475565]">
          追蹤用戶
        </h1>
        <div className="user-data-panel min-h-[100px]">
          {userFollowings.length === 0 ? (
            <div className="mt-5 flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-slate-100 p-6">
              <img
                src="/undraw_conversation_re_c26v.svg"
                className="h-[150px] w-[150px]"
              />
              <p className="text-sm font-bold text-[#94a3ab]">
                你還沒有發摟任何人！
              </p>
            </div>
          ) : (
            userFollowings.map((profileUser) => {
              return (
                <>
                  <div className="flex items-center justify-between py-5">
                    <a
                      href={`/profile/${profileUser.userId}/activity`}
                      className="user-card flex items-center p-2"
                    >
                      <Avatar src={profileUser.avatar} className="mr-2" />
                      <span>{profileUser.username}</span>
                    </a>
                    <div>
                      {user.userId !== profileUser.userId && isLogin && (
                        <Button
                          size="sm"
                          variant="shadow"
                          className={`ml-5 ${
                            isUserFollowed(profileUser.userId)
                              ? userHoverStates[profileUser.userId]
                                ? 'bg-[#bf2e5c] text-white'
                                : 'bg-[#89a9a6] tracking-wider text-white'
                              : 'bg-[#f46854] tracking-wider text-white'
                          }`}
                          onClick={() =>
                            handleFollowUser(
                              profileUser.userId,
                              user.userId,
                              profileUser
                            )
                          }
                          onMouseEnter={() =>
                            setUserHoverState((prev) => ({
                              ...prev,
                              [profileUser.userId]: true,
                            }))
                          }
                          onMouseLeave={() =>
                            setUserHoverState((prev) => ({
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
            })
          )}
        </div>
      </div>
      <div className="follower-section w-5/12">
        <h1 className="text-center text-base font-semibold text-[#475565]">
          粉絲
        </h1>
        <div className="user-data-panel min-h-[100px]">
          {userFollowers.length === 0 ? (
            <div className="mt-5 flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-slate-100 p-6">
              <img
                src="/undraw_social_friends_re_7uaa.svg"
                className="h-[150px] w-[150px]"
              />
              <p className="text-sm font-bold text-[#94a3ab]">
                你的天才還等待世界發掘！
              </p>
            </div>
          ) : (
            userFollowers.map((profileUser) => {
              return (
                <>
                  <div className="flex items-center justify-between py-5">
                    <a
                      href={`/profile/${profileUser.userId}/activity`}
                      className="user-card flex items-center p-2"
                    >
                      <Avatar src={profileUser.avatar} className="mr-2" />
                      <span>{profileUser.username}</span>
                    </a>

                    <div>
                      {user.userId !== profileUser.userId && isLogin && (
                        <Button
                          size="sm"
                          variant="shadow"
                          className={`ml-5 ${
                            isUserFollowed(profileUser.userId)
                              ? userHoverStates[profileUser.userId]
                                ? 'bg-[#bf2e5c] text-white'
                                : 'bg-[#89a9a6] tracking-wider text-white'
                              : 'bg-[#f46854] tracking-wider text-white'
                          }`}
                          onClick={() =>
                            handleFollowUser(
                              profileUser.userId,
                              user.userId,
                              profileUser
                            )
                          }
                          onMouseEnter={() =>
                            setUserHoverState((prev) => ({
                              ...prev,
                              [profileUser.userId]: true,
                            }))
                          }
                          onMouseLeave={() =>
                            setUserHoverState((prev) => ({
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
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Network

import { useState } from 'react'
import useUserStore from '../../store/userStore'
import { Avatar, Button, Divider } from '@nextui-org/react'
import { FollowUserState } from '../../utils/type'
import { db } from '../../../firebase'
import { setDoc, doc, deleteDoc } from 'firebase/firestore'

interface FollowUsersCardState {
  profileUser: FollowUserState
  followingUserIds: string[]
}

interface HoverState {
  [key: string]: boolean
}

const FollowUsersCard = ({
  profileUser,
  followingUserIds,
}: FollowUsersCardState) => {
  const [userHoverStates, setUserHoverState] = useState<HoverState>({})
  const { user, isLogin } = useUserStore()

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
                handleFollowUser(profileUser.userId, user.userId, profileUser)
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
}

export default FollowUsersCard

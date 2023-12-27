import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore'
import { db } from '../../../firebase'
import useUserStore from '../../store/userStore'
import { useParams } from 'react-router-dom'
import { Spinner } from '@nextui-org/react'
import NoFollowerEmptyState from '../../components/EmptyStates/NoFollowerEmptyState'
import NoFollowingEmptyState from '../../components/EmptyStates/NoFollowingEmptyState'
import FollowUsersCard from './FollowUsersCard'

const Network = () => {
  const [followingUserIds, setFollowingUserIds] = useState<string[]>([])
  const { user, userFollowers, userFollowings } = useUserStore()
  const { userId } = useParams()
  let userFollowingRef: CollectionReference

  useEffect(() => {
    if (user.userId) {
      userFollowingRef = collection(db, 'USERS', user.userId, 'FOLLOWING')
    } else {
      userFollowingRef = collection(db, 'USERS', 'guest', 'FOLLOWING')
    }

    const unsubFollowingUserIds = onSnapshot(
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
      unsubFollowingUserIds()
    }
  }, [])

  if (!userId) return
  if (!userFollowings || !userFollowers) {
    return <Spinner className="flex w-5/12 items-center justify-between py-5" />
  }

  return (
    <div className="page-container flex justify-between">
      <div className="following-section w-5/12">
        <h1 className="text-center text-base font-semibold text-[#475565]">
          追蹤用戶
        </h1>
        <div className="user-data-panel min-h-[100px]">
          {userFollowings.length === 0 ? (
            <NoFollowingEmptyState />
          ) : (
            userFollowings.map((profileUser) => {
              return (
                <FollowUsersCard
                  profileUser={profileUser}
                  followingUserIds={followingUserIds}
                />
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
            <NoFollowerEmptyState />
          ) : (
            userFollowers.map((profileUser) => {
              return (
                <FollowUsersCard
                  profileUser={profileUser}
                  followingUserIds={followingUserIds}
                />
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Network

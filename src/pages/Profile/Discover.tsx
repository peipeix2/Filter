import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import {
  collection,
  getDocs,
  collectionGroup,
  where,
  query,
} from 'firebase/firestore'
import { db } from '../../../firebase'
import CommentCard from '../../components/CommentCard'
import { Skeleton } from '@nextui-org/react'
import DiscoverPage from '../../components/EmptyStates/DiscoverPage'
import { CommentState, ReviewState } from '../../utils/type'

const Discover = () => {
  const [followingUserIds, setFollowingUserIds] = useState<string[]>([])
  const [followingUsersComments, setFollowingUsersComments] = useState<
    CommentState[] | null
  >(null)
  const [followingUsersReviews, setFollowingUsersReviews] = useState<
    ReviewState[] | null
  >(null)
  const { user } = useUserStore()
  const { userId } = useParams()

  const isCurrentUser = user.userId === userId

  useEffect(() => {
    if (userId) {
      fetchFollowingUserIds(userId)
    }
  }, [])

  useEffect(() => {
    if (followingUserIds.length > 0) {
      fetchFollowingUserPosts('COMMENTS').then((comment) =>
        setFollowingUsersComments(comment as CommentState[])
      )
      fetchFollowingUserPosts('REVIEWS').then((review) =>
        setFollowingUsersReviews(review as ReviewState[])
      )
    }
  }, [followingUserIds])

  const fetchFollowingUserIds = async (currentUserId: string) => {
    const userFollowingRef = collection(db, 'USERS', currentUserId, 'FOLLOWING')
    const querySnapshot = await getDocs(userFollowingRef)
    const followingIds: string[] = []
    querySnapshot.forEach((doc) => {
      followingIds.push(doc.id)
    })
    setFollowingUserIds(followingIds)
  }

  const fetchFollowingUserPosts = async (collection: string) => {
    const allPosts: (CommentState | ReviewState)[] = []
    for (const followingUserId of followingUserIds) {
      const followingUserPostsQuery = query(
        collectionGroup(db, collection),
        where('userId', '==', followingUserId),
        where('isPublic', '==', true)
      )
      const postsQuerySnapshot = await getDocs(followingUserPostsQuery)

      postsQuerySnapshot.forEach((doc) => {
        const post = doc.data()
        allPosts.push({ id: doc.id, ...post } as CommentState | ReviewState)
      })
    }

    const sortedPosts = allPosts.sort(
      (a: CommentState | ReviewState, b: CommentState | ReviewState) =>
        b.updated_at.toMillis() - a.updated_at.toMillis()
    )
    return sortedPosts
  }

  if (!isCurrentUser) {
    return <div>You can only view your own Discover page.</div>
  }

  if (followingUserIds.length === 0) {
    return <DiscoverPage />
  }

  if (!followingUsersComments) {
    return <Skeleton className="my-5 h-40 w-full"></Skeleton>
  }

  if (!followingUsersReviews) {
    return <Skeleton className="my-5 h-40 w-full"></Skeleton>
  }

  return (
    <div>
      <h1 className="text-base font-semibold text-[#475565]">他們的評論</h1>
      {followingUsersComments.length === 0 &&
        followingUsersReviews.length === 0 && <DiscoverPage />}
      {followingUsersComments.map((post, index) => {
        return (
          <CommentCard
            post={post}
            followingUsersComments={followingUsersComments}
            setFollowingUsersComments={setFollowingUsersComments}
            currentUserId={user.userId}
            key={index}
          />
        )
      })}

      <h1 className="mt-40 text-base font-semibold text-[#475565]">
        他們的影評
      </h1>
      {followingUsersReviews.map((post, index) => {
        return (
          <CommentCard
            post={post}
            followingUsersComments={followingUsersReviews}
            setFollowingUsersComments={setFollowingUsersReviews}
            currentUserId={user.userId}
            key={index}
          />
        )
      })}
    </div>
  )
}

export default Discover

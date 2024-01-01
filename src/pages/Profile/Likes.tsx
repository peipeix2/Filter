import { useState, useEffect } from 'react'
import { collectionGroup, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'
import { useParams } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import CommentCard from '../../components/CommentCard'
import { Spinner } from '@nextui-org/react'
import { CommentState, ReviewState } from '../../utils/type'
import LikesCommentEmptyState from '../../components/EmptyStates/LikesCommentEmptyState'
import LikesReviewEmptyState from '../../components/EmptyStates/LikesReviewEmptyState'

const Likes = () => {
  const [likedComments, setLikedComments] = useState<
    CommentState[] | ReviewState[] | null
  >(null)
  const [likedReviews, setLikedReviews] = useState<
    ReviewState[] | ReviewState[] | null
  >(null)
  const user = useUserStore((state) => state.user)
  const { userId } = useParams()

  useEffect(() => {
    if (userId) {
      fetchLikedPosts(userId)
    }
  }, [])

  const fetchLikedPosts = async (profileUserId: string) => {
    const commentsQuery = query(
      collectionGroup(db, 'COMMENTS'),
      where('likesUser', 'array-contains', profileUserId)
    )
    const reviewsQuery = query(
      collectionGroup(db, 'REVIEWS'),
      where('likesUser', 'array-contains', profileUserId)
    )

    const [commentsSnapshot, reviewsSnapshot] = await Promise.all([
      getDocs(commentsQuery),
      getDocs(reviewsQuery),
    ])

    let likedComments: CommentState[] = []
    commentsSnapshot.forEach((doc) => {
      likedComments.push({ id: doc.id, ...doc.data() } as CommentState)
    })

    let likedReviews: ReviewState[] = []
    reviewsSnapshot.forEach((doc) => {
      likedReviews.push({ id: doc.id, ...doc.data() } as ReviewState)
    })

    likedComments = likedComments.sort(
      (a: CommentState, b: CommentState) =>
        b.updated_at.toMillis() - a.updated_at.toMillis()
    )
    setLikedComments(likedComments)

    likedReviews = likedReviews.sort(
      (a: ReviewState, b: ReviewState) =>
        b.updated_at.toMillis() - a.updated_at.toMillis()
    )
    setLikedReviews(likedReviews)
  }

  if (!likedComments || !likedReviews) {
    return <Spinner className="my-5 h-[100px] w-full" color="default" />
  }

  return (
    <>
      <p className="text-base font-semibold text-[#475565]">點讚的評論</p>
      {likedComments.length === 0 ? (
        <LikesCommentEmptyState />
      ) : (
        likedComments.map((comment, index) => {
          return (
            <CommentCard
              post={comment}
              followingUsersComments={likedComments}
              setFollowingUsersComments={setLikedComments}
              currentUserId={user.userId}
              key={index}
            />
          )
        })
      )}

      <p className="mt-40 text-base font-semibold text-[#475565]">點讚的影評</p>
      {likedReviews.length === 0 ? (
        <LikesReviewEmptyState />
      ) : (
        likedReviews.map((review, index) => {
          return (
            <CommentCard
              post={review}
              followingUsersComments={likedReviews}
              setFollowingUsersComments={setLikedReviews}
              currentUserId={user.userId}
              key={index}
            />
          )
        })
      )}
    </>
  )
}

export default Likes

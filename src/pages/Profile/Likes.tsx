import { useState, useEffect } from 'react'
import { collectionGroup, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'
import { useParams } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import CommentCard from '../../components/CommentCard'
import { Skeleton } from '@nextui-org/react'
import { CommentState, ReviewState } from '../../utils/type'

const Likes = () => {
  const [likedComments, setLikedComments] = useState<CommentState[] | null>(
    null
  )
  const [likedReviews, setLikedReviews] = useState<ReviewState[] | null>(null)
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

  if (!likedComments) {
    return <Skeleton className="my-5 h-[100px] w-full"></Skeleton>
  }

  if (!likedReviews) {
    return <Skeleton className="my-5 h-[100px] w-full"></Skeleton>
  }

  return (
    <>
      <p className="text-base font-semibold text-[#475565]">點讚的評論</p>
      {likedComments.length === 0 ? (
        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-slate-100 p-6">
          <img src="/undraw_love_it_xkc2.svg" className="h-[150px] w-[150px]" />
          <p className="text-sm font-bold text-[#94a3ab]">
            給你喜歡的評論多一點愛吧！
          </p>
        </div>
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
        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-slate-100 p-6">
          <img src="/undraw_love_it_xkc2.svg" className="h-[150px] w-[150px]" />
          <p className="text-sm font-bold text-[#94a3ab]">
            給你喜歡的影評多一點愛吧！
          </p>
        </div>
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

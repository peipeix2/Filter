import { useState, useEffect } from 'react'
import { collectionGroup, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'
import { useParams } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import CommentCard from '../../components/CommentCard'
import ReviewCard from '../../components/CommentCard/ReviewCard'
import { Skeleton } from '@nextui-org/react'

interface userMoviesCommentsState {
  id: string
  author: string
  userId: string
  avatar: string
  comment: string
  comments_count: number
  created_at: Date
  isPublic: boolean
  likes_count: number
  movie_id: number
  rating: number
  tags: string[]
  updated_at: any
  movie_title: string
  movie_original_title: string
  movie_backdrop_path: string
  movie_poster: string
  movie_release: string
}

interface userMoviesReviewsState {
  id: string
  title: string
  author: string
  userId: string
  avatar: string
  review: string
  comments_count: number
  created_at: Date
  isPublic: boolean
  likes_count: number
  movie_id: number
  rating: number
  tags: string[]
  updated_at: any
  movie_title: string
  movie_original_title: string
  movie_backdrop_path: string
  movie_poster: string
  movie_release: string
}

const Likes = () => {
  const [likedComments, setLikedComments] = useState<any>(null)
  const [likedReviews, setLikedReviews] = useState<any>(null)
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

    let likedComments: any = []
    commentsSnapshot.forEach((doc) => {
      likedComments.push({ id: doc.id, ...doc.data() })
    })

    let likedReviews: any = []
    reviewsSnapshot.forEach((doc) => {
      likedReviews.push({ id: doc.id, ...doc.data() })
    })

    likedComments = likedComments.sort(
      (a: userMoviesCommentsState, b: userMoviesCommentsState) =>
        b.updated_at - a.updated_at
    )
    setLikedComments(likedComments)

    likedReviews = likedReviews.sort(
      (a: userMoviesReviewsState, b: userMoviesReviewsState) =>
        b.updated_at - a.updated_at
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
        likedComments.map((comment: any, index: number) => {
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
        likedReviews.map((review: any, index: number) => {
          return (
            <ReviewCard
              post={review}
              followingUsersReviews={likedReviews}
              setFollowingUsersReviews={setLikedReviews}
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

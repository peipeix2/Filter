import { useState, useEffect } from 'react'
import { collectionGroup, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'
import CommentLikeBtn from '../../components/Like/CommentLikeBtn'
import Like from '../../components/Like'
import CommentStar from '../../components/Star/CommentStar'
import { Image, Divider } from '@nextui-org/react'
import { Link, useParams } from 'react-router-dom'
import { FaCommentAlt } from 'react-icons/fa'
import useUserStore from '../../store/userStore'
import parser from 'html-react-parser'

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
  const [likedComments, setLikedComments] = useState<any>([])
  const [likedReviews, setLikedReviews] = useState<any>([])
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

    const [commentsSnapshot, reviewsSnapshot] = await Promise.all([getDocs(commentsQuery), getDocs(reviewsQuery)])

    let likedComments:any = []
    commentsSnapshot.forEach(doc => {
      likedComments.push({ id: doc.id, ...doc.data() })
    })

    let likedReviews:any = []
    reviewsSnapshot.forEach(doc => {
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

  if (!likedComments) return

  return (
    <>
      <p className="mb-5 text-center">點讚的評論</p>
      {likedComments.map((comment:any, index:number) => {
        return (
          <div className="comment-card">
            <>
              <div className="comment-card my-5 flex items-center" key={index}>
                <div className="avatar-wrapper flex w-[100px] items-start">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${comment.movie_poster}`}
                    alt={comment.original_title}
                    isBlurred
                  />
                </div>
                <div className="comment-rating ml-10 flex-grow">
                  <div className="movie-info-header mb-2 flex items-baseline text-lg">
                    <h1 className="mr-2 font-bold">{comment.movie_title}</h1>
                    <span className="text-sm">
                      {comment.movie_original_title}
                    </span>
                  </div>
                  <Link to={`/comment/${comment.userId}/${comment.id}`}>
                    <div className="comment-header flex">
                      {comment.userId !== userId ? (
                        <div className="comment-user mr-2 flex">
                          <span className="mr-1 text-sm text-slate-400">
                            評論作者
                          </span>
                          <span className="text-sm font-semibold text-slate-800">
                            {comment.author}
                          </span>
                        </div>
                      ) : (
                        <div className="comment-user mr-2 flex">
                          <span className="mr-1 text-sm text-slate-400">
                            評論日期
                          </span>
                          <span className="text-sm font-semibold text-slate-800">
                            {comment.created_at.toDate().toDateString()}
                          </span>
                        </div>
                      )}
                      <CommentStar rating={comment.rating} />
                      <div className="comment-count ml-2 flex items-center">
                        <FaCommentAlt className="text-xs" />
                        <span className="ml-1 text-sm">
                          {comment.comments_count}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="comment-content my-5">
                    <p className="comment">{comment.comment}</p>
                  </div>

                  <div className="tags">
                    <ul className="flex gap-1">
                      {comment.tags.map((tag: string, index: number) => {
                        return (
                          <li
                            className="p-1 text-sm text-slate-400"
                            key={index}
                          >
                            #{tag}
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <CommentLikeBtn
                    postId={comment.id}
                    count={comment.likes_count}
                    authorId={comment.userId}
                    isLiked={
                      comment.likesUser &&
                      comment.likesUser.includes(user.userId)
                    }
                  />
                </div>
              </div>
              <Divider />
            </>
          </div>
        )
      })}

      <p className="my-5 mt-10 text-center">點讚的影評</p>
      {likedReviews.map((review:any, index:number) => {
        return (
          <div className="comment-card">
            <>
              <div className="comment-card my-5 flex items-center" key={index}>
                <div className="avatar-wrapper flex w-[100px] items-start">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${review.movie_poster}`}
                    alt={review.original_title}
                    isBlurred
                  />
                </div>
                <div className="comment-rating ml-10 flex-grow">
                  <div className="movie-info-header mb-2 flex items-baseline text-lg">
                    <h1 className="mr-2 font-bold">{review.movie_title}</h1>
                    <span className="text-sm">
                      {review.movie_original_title}
                    </span>
                  </div>
                  <Link to={`/comment/${review.userId}/${review.id}`}>
                    <div className="comment-header flex">
                      {review.userId !== userId ? (
                        <div className="comment-user mr-2 flex">
                          <span className="mr-1 text-sm text-slate-400">
                            評論作者
                          </span>
                          <span className="text-sm font-semibold text-slate-800">
                            {review.author}
                          </span>
                        </div>
                      ) : (
                        <div className="comment-user mr-2 flex">
                          <span className="mr-1 text-sm text-slate-400">
                            評論日期
                          </span>
                          <span className="text-sm font-semibold text-slate-800">
                            {review.created_at.toDate().toDateString()}
                          </span>
                        </div>
                      )}
                      <CommentStar rating={review.rating} />
                      <div className="comment-count ml-2 flex items-center">
                        <FaCommentAlt className="text-xs" />
                        <span className="ml-1 text-sm">
                          {review.comments_count}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="comment-content my-5">
                    <p className="comment">{parser(review.review)}</p>
                  </div>

                  <div className="tags">
                    <ul className="flex gap-1">
                      {review.tags.map((tag: string, index: number) => {
                        return (
                          <li
                            className="p-1 text-sm text-slate-400"
                            key={index}
                          >
                            #{tag}
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <Like
                    postId={review.id}
                    count={review.likes_count}
                    authorId={review.userId}
                    isLiked={
                      review.likesUser && review.likesUser.includes(user.userId)
                    }
                  />
                </div>
              </div>
              <Divider />
            </>
          </div>
        )
      })}
    </>
  )
}

export default Likes

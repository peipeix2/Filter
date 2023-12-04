import { useState, useEffect } from 'react'
import { collectionGroup, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'
import CommentStar from '../../components/Star/CommentStar'
import { Image, Divider, Chip } from '@nextui-org/react'
import { Link, useParams } from 'react-router-dom'
import { FaCommentAlt } from 'react-icons/fa'
import useUserStore from '../../store/userStore'
import parser from 'html-react-parser'
import DiscoverLikeBtn from '../../components/Like/DiscoverLikeBtn'
import DiscoverLikeReviewBtn from '../../components/Like/DiscoverLikeReviewBtn'
import { FaTag } from 'react-icons/fa6'

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

  if (!likedComments) return

  return (
    <>
      <p className="text-base font-semibold text-[#475565]">點讚的評論</p>
      {likedComments.map((comment: any, index: number) => {
        return (
          <div className="comment-card" key={index}>
            <div className="comment-card my-5 flex items-center">
              <div className="avatar-wrapper flex w-[100px] items-start">
                <Link to={`/movies/${comment.movie_id}`}>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${comment.movie_poster}`}
                    alt={comment.original_title}
                    isBlurred
                  />
                </Link>
              </div>

              <div className="comment-rating ml-10 w-2/3">
                <Link to={`/movies/${comment.movie_id}`}>
                  <div className="movie-info-header mb-2 flex items-baseline text-lg hover:text-[#89a9a6]">
                    <h1 className="mr-2 font-bold">{comment.movie_title}</h1>
                    <span className="text-sm">
                      {comment.movie_original_title}
                    </span>
                  </div>
                </Link>
                <Link to={`/comment/${comment.userId}/${comment.id}`}>
                  <div className="comment-header flex">
                    {comment.userId !== userId ? (
                      <>
                        <div className="comment-user mr-2 flex">
                          <span className="mr-1 text-sm text-slate-400">
                            評論作者
                          </span>
                          <span className="text-sm font-semibold text-slate-800">
                            {comment.author}
                          </span>
                        </div>
                        <div className="comment-user mr-2 flex">
                          {/* <span className="mr-1 text-sm text-slate-400">
                            評論日期
                          </span> */}
                          <span className="text-sm font-thin text-slate-800">
                            {comment.created_at.toDate().toDateString()}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="comment-user mr-2 flex">
                        {/* <span className="mr-1 text-sm text-slate-400">
                            評論日期
                          </span> */}
                        <span className="text-sm font-thin text-slate-800">
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
                  <p className="comment text-sm">{comment.comment}</p>
                </div>

                <div className="tags mb-3">
                  <ul className="flex items-center gap-1">
                    {comment.tags.map((tag: string, index: number) => {
                      return (
                        <Link to={`/tag?keyword=${tag}`}>
                          <Chip
                            className="p-1 text-xs text-slate-100"
                            key={index}
                            size="sm"
                            startContent={<FaTag size={12} color="#f1f5f9" />}
                          >
                            {tag}
                          </Chip>
                        </Link>
                      )
                    })}
                  </ul>
                </div>

                <DiscoverLikeBtn
                  postId={comment.id}
                  count={comment.likes_count}
                  authorId={comment.userId}
                  isLiked={comment.likesUser?.includes(user.userId)}
                  followingUsersComments={likedComments}
                  setFollowingUsersComments={setLikedComments}
                />
              </div>
            </div>
            <Divider />
          </div>
        )
      })}

      <p className="mt-40 text-base font-semibold text-[#475565]">點讚的影評</p>
      {likedReviews.map((review: any, index: number) => {
        return (
          <div className="comment-card">
            <div className="comment-card my-5 flex items-center" key={index}>
              <div className="avatar-wrapper flex w-[100px] items-start">
                <Link to={`/movies/${review.movie_id}`}>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${review.movie_poster}`}
                    alt={review.original_title}
                    isBlurred
                  />
                </Link>
              </div>
              <div className="comment-rating ml-10 w-2/3">
                <Link to={`/movies/${review.movie_id}`}>
                  <div className="movie-info-header mb-2 flex items-baseline text-lg hover:text-[#89a9a6]">
                    <h1 className="mr-2 font-bold">{review.movie_title}</h1>
                    <span className="text-sm">
                      {review.movie_original_title}
                    </span>
                  </div>
                </Link>
                <Link to={`/comment/${review.userId}/${review.id}`}>
                  <div className="comment-header flex">
                    {review.userId !== userId ? (
                      <>
                        <div className="comment-user mr-2 flex">
                          <span className="mr-1 text-sm text-slate-400">
                            評論作者
                          </span>
                          <span className="text-sm font-semibold text-slate-800">
                            {review.author}
                          </span>
                        </div>
                        <div className="comment-user mr-2 flex">
                          {/* <span className="mr-1 text-sm text-slate-400">
                            評論日期
                          </span> */}
                          <span className="text-sm font-thin text-slate-800">
                            {review.created_at.toDate().toDateString()}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="comment-user mr-2 flex">
                        {/* <span className="mr-1 text-sm text-slate-400">
                            評論日期
                          </span> */}
                        <span className="text-sm font-thin text-slate-800">
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
                  <p className="comment line-clamp-3 text-sm leading-10">
                    {parser(review.review)}
                  </p>
                </div>

                <div className="tags mb-3">
                  <ul className="flex items-center gap-1">
                    {review.tags.map((tag: string, index: number) => {
                      return (
                        <Link to={`/tag?keyword=${tag}`}>
                          <Chip
                            className="p-1 text-xs text-slate-100"
                            key={index}
                            size="sm"
                            startContent={<FaTag size={12} color="#f1f5f9" />}
                          >
                            {tag}
                          </Chip>
                        </Link>
                      )
                    })}
                  </ul>
                </div>

                <DiscoverLikeReviewBtn
                  postId={review.id}
                  count={review.likes_count}
                  authorId={review.userId}
                  isLiked={
                    review.likesUser && review.likesUser.includes(user.userId)
                  }
                  followingUsersReviews={likedReviews}
                  setFollowingUsersReviews={setLikedReviews}
                />
              </div>
            </div>
            <Divider />
          </div>
        )
      })}
    </>
  )
}

export default Likes

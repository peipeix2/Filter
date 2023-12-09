import { useEffect } from 'react'
import { db } from '../../../firebase'
import { Image, Divider } from '@nextui-org/react'
import { collection, onSnapshot } from 'firebase/firestore'
import useUserStore from '../../store/userStore'
import { useParams, Link } from 'react-router-dom'
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt } from 'react-icons/fa'
import CommentLikeBtn from '../../components/Like/CommentLikeBtn'
import Tag from '../../components/Tag'

const Activity = () => {
  const {
    user,
    userMoviesComments,
    setUserMoviesComments,
    userMoviesReviews,
    setUserMoviesReviews,
  } = useUserStore()
  const { userId } = useParams()

  if (!userId) return

  useEffect(() => {
    // Promise.all([fetchUserComments(userId), fetchUserReviews(userId)])
    const commentDocRef = collection(db, 'USERS', userId, 'COMMENTS')
    const reviewDocRef = collection(db, 'USERS', userId, 'REVIEWS')

    const unsubscribeComments = onSnapshot(commentDocRef, (querySnapshot) => {
      const comments: any = []
      querySnapshot.forEach((doc) => {
        const commentsData = doc.data()
        const commentsWithId = { ...commentsData, id: doc.id }
        comments.push(commentsWithId)
      })
      setUserMoviesComments(comments)
    })

    const unsubscribeReviews = onSnapshot(reviewDocRef, (querySnapshot) => {
      const reviews: any = []
      querySnapshot.forEach((doc) => {
        const reviewsData = doc.data()
        const reviewsWithId = { ...reviewsData, id: doc.id }
        reviews.push(reviewsWithId)
      })
      setUserMoviesReviews(reviews)
    })

    return () => {
      unsubscribeComments()
      unsubscribeReviews()
    }
  }, [])

  userMoviesComments.sort((a: any, b: any) => {
    return b.created_at - a.created_at
  })

  userMoviesReviews.sort((a: any, b: any) => {
    return b.created_at - a.created_at
  })

  // Check if this page belongs to login user
  let displayComments
  let displayReviews
  if (user.userId !== userId) {
    displayComments = userMoviesComments.filter(
      (comment) => comment.isPublic === true
    )
    displayReviews = userMoviesReviews.filter(
      (comment) => comment.isPublic === true
    )
  } else {
    displayComments = userMoviesComments
    displayReviews = userMoviesReviews
  }

  return (
    <div>
      <div className="mb-5 flex w-full justify-between">
        <p className="text-base font-semibold text-[#475565]">評論的電影</p>
        {/* {displayComments.length > 5 && <span>More</span>} */}
      </div>

      <div className="flex flex-wrap gap-2">
        {displayComments.map((comment) => {
          return (
            <div
              className="movie-card flex w-[18%] flex-col gap-3"
              key={comment.id}
            >
              <Link to={`/comment/${comment.userId}/${comment.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${comment.movie_poster}`}
                  alt={comment.movie_original_title}
                  isBlurred
                  className="mb-2"
                />
                <CommentStar rating={comment.rating} />
              </Link>
            </div>
          )
        })}
      </div>

      <div className="mb-5 mt-20 flex w-full justify-between">
        <p className="text-base font-semibold text-[#475565]">撰寫的影評</p>
        {/* {displayReviews.length > 5 && <span>More</span>} */}
      </div>

      <div className="flex gap-2">
        {displayReviews.map((review) => {
          return (
            <div
              className="movie-card flex w-[18%] flex-col gap-3"
              key={review.id}
            >
              <Link to={`/read/${review.userId}/${review.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${review.movie_poster}`}
                  alt={review.movie_original_title}
                  isBlurred
                  className="mb-2"
                />
                <CommentStar rating={review.rating} />
              </Link>
            </div>
          )
        })}
      </div>

      <div className="mb-5 mt-20 flex w-full justify-between">
        <p className="text-base font-semibold text-[#475565]">最新評論</p>
      </div>

      {displayComments.slice(0, 3).map((comment: any, index: number) => {
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
                      return <Tag tag={tag} index={index} />
                    })}
                  </ul>
                </div>

                <CommentLikeBtn
                  postId={comment.id}
                  count={comment.likes_count}
                  authorId={comment.userId}
                  isLiked={
                    comment.likesUser && comment.likesUser.includes(user.userId)
                  }
                />
              </div>
            </div>
            <Divider />
          </div>
        )
      })}
    </div>
  )
}

export default Activity

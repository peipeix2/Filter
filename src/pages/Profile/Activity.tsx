import { Image } from '@nextui-org/react'
import useUserStore from '../../store/userStore'
import { useParams, Link } from 'react-router-dom'
import CommentStar from '../../components/Star/CommentStar'
import ActivityEmptyState from '../../components/EmptyStates/ActivityEmptyState'
import { CommentState, ReviewState } from '../../utils/type'

const Activity = () => {
  const { user, userMoviesComments, userMoviesReviews } = useUserStore()
  const { userId } = useParams()

  if (!userId) return

  userMoviesComments.sort((a: CommentState, b: CommentState) => {
    return b.created_at.toMillis() - a.created_at.toMillis()
  })

  userMoviesReviews.sort((a: ReviewState, b: ReviewState) => {
    return b.created_at.toMillis() - a.created_at.toMillis()
  })

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

  if (userMoviesComments.length === 0 && userMoviesReviews.length === 0) {
    return <ActivityEmptyState />
  }

  return (
    <div>
      <div className="mb-5 flex w-full justify-between">
        <p className="text-base font-semibold text-[#475565]">評論的電影</p>
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
                  className="mb-2 min-h-full min-w-full object-cover"
                  style={{ aspectRatio: '2/3' }}
                />
                <CommentStar rating={comment.rating} />
              </Link>
            </div>
          )
        })}
      </div>

      <div className="mb-5 mt-20 flex w-full justify-between">
        <p className="text-base font-semibold text-[#475565]">撰寫的影評</p>
      </div>

      <div className="flex gap-2">
        {displayReviews.map((review) => {
          return (
            <div
              className="movie-card flex h-full w-[18%] flex-col gap-3"
              key={review.id}
            >
              <Link to={`/read/${review.userId}/${review.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${review.movie_poster}`}
                  alt={review.movie_original_title}
                  isBlurred
                  className="mb-2 min-h-full min-w-full object-cover"
                  style={{ aspectRatio: '2/3' }}
                />
                <CommentStar rating={review.rating} />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Activity

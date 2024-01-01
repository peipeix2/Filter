import useUserStore from '../../store/userStore'
import { useParams } from 'react-router-dom'
import ActivityEmptyState from '../../components/EmptyStates/ActivityEmptyState'
import { CommentState, ReviewState } from '../../utils/type'
import PosterPost from './PosterPost'

const Activity = () => {
  const { user, userMoviesComments, userMoviesReviews } = useUserStore()
  const { userId } = useParams()

  if (!userId) return

  userMoviesComments.sort((a: CommentState, b: CommentState) => {
    return b.created_at?.toMillis() - a.created_at?.toMillis()
  })

  userMoviesReviews.sort((a: ReviewState, b: ReviewState) => {
    return b.created_at?.toMillis() - a.created_at?.toMillis()
  })

  let displayComments
  let displayReviews
  const isCurrentUser = user.userId === userId
  if (!isCurrentUser) {
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

  const activitySection = [
    {
      title: '評論的電影',
      content: displayComments,
    },
    {
      title: '撰寫的影評',
      content: displayReviews,
    },
  ]

  return (
    <div className="flex flex-col gap-20">
      {activitySection.map((item, index) => {
        return (
          <div key={index}>
            <div className="mb-5 flex w-full justify-between">
              <p className="text-base font-semibold text-[#475565]">
                {item.title}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {item.content.map((post) => {
                return <PosterPost post={post} />
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Activity

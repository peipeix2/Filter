import { Link } from 'react-router-dom'
import parser from 'html-react-parser'
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt } from 'react-icons/fa'
import OnSnapShotLikeBtn from '../Like/OnSnapShotLikeBtn'
import { PostState } from '../../utils/type'

interface ReviewCardState {
  post: PostState
  currentUserId: string
}

const ReviewCardforReading = (Props: ReviewCardState) => {
  return (
    <div className="comment-card mx-auto my-5 flex items-start">
      <Link
        to={`/profile/${Props.post.userId}`}
        className="avatar-wrapper mt-5 flex w-1/4"
      >
        <div
          className="avatar mx-10 h-10 w-10 rounded-full bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${Props.post.avatar})`,
          }}
        />
      </Link>
      <div className="comment-content-btn-container mx-auto flex w-3/4 flex-col items-start">
        <div className="comment-rating w-full">
          <h1 className="mb-5 font-bold">{Props.post.title}</h1>

          <div className="comment-header flex">
            <div className="comment-user mr-2 flex">
              <span className="mr-1 text-sm text-slate-400">評論作者</span>
              <span className="text-sm font-semibold text-slate-800">
                {Props.post.author}
              </span>
            </div>
            <CommentStar rating={Props.post.rating} />
            <div className="comment-count ml-2 flex items-center text-slate-400">
              <FaCommentAlt className="text-xs" />
              <span className="ml-1 text-sm">{Props.post.comments_count}</span>
            </div>
          </div>

          <div className="comment-content my-5">
            <p className="break-words leading-10">
              {Props.post.review ? parser(Props.post.review) : null}
            </p>
          </div>

          <div className="like">
            <OnSnapShotLikeBtn
              postId={Props.post.id}
              postCategory="REVIEWS"
              isLiked={
                Props.post.likesUser &&
                Props.post.likesUser.includes(Props.currentUserId)
              }
              count={Props.post.likes_count}
              authorId={Props.post.userId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewCardforReading

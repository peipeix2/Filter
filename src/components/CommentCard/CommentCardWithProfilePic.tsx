import { Link } from 'react-router-dom'
import CommentStar from '../Star/CommentStar'
import Tag from '../../components/Tag'
import { FaCommentAlt } from 'react-icons/fa'
import OnSnapShotLikeBtn from '../Like/OnSnapShotLikeBtn'
import parser from 'html-react-parser'
import { PostState } from '../../utils/type'

interface CommentCardState {
  post: PostState
  currentUserId: string
}

const CommentCardWithProfilePic = (Props: CommentCardState) => {
  return (
    <>
      <div className="comment-card my-5 flex items-start">
        <div className="avatar-wrapper mx-5 mt-5 flex xl:mx-10">
          <Link to={`/profile/${Props.post.userId}`}>
            <div
              className="avatar mx-auto h-10 w-10 rounded-full bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${Props.post.avatar})`,
              }}
            />
          </Link>
        </div>
        <div className="comment-rating xl:w-2/3">
          <Link
            to={
              Props.post.review
                ? `/read/${Props.post.userId}/${Props.post.id}`
                : `/comment/${Props.post.userId}/${Props.post.id}`
            }
          >
            {Props.post.review && (
              <h1 className="mb-2 font-bold xl:mb-5">{Props.post.title}</h1>
            )}
            <div className="comment-header flex w-full flex-col gap-2 xl:flex-row xl:gap-0">
              <div className="comment-user mr-2 flex">
                <span className="mr-1 text-xs text-slate-400 xl:text-sm">
                  評論作者
                </span>
                <span className="text-xs font-semibold text-slate-800 xl:text-sm">
                  {Props.post.author}
                </span>
              </div>
              <div className="flex gap-2 xl:gap-0">
                <CommentStar rating={Props.post.rating} />
                <div className="comment-count flex items-center text-slate-400 xl:ml-2">
                  <FaCommentAlt className="text-xs" />
                  <span className="ml-1 text-xs xl:text-sm">
                    {Props.post.comments_count}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <div className="comment-content my-5 text-sm">
            {Props.post.comment ? (
              <p className="comment break-words">{Props.post.comment}</p>
            ) : (
              <p className="comment line-clamp-3 break-words text-sm leading-10">
                {Props.post.review && parser(Props.post.review)}
              </p>
            )}
          </div>

          <div className="tags mb-3">
            <ul className="flex gap-1">
              {Props.post.tags?.map((tag, index) => {
                return <Tag tag={tag} index={index} />
              })}
            </ul>
          </div>

          <OnSnapShotLikeBtn
            postCategory={Props.post.review ? 'REVIEWS' : 'COMMENTS'}
            postId={Props.post.id}
            count={Props.post.likes_count}
            authorId={Props.post.userId}
            isLiked={
              Props.post.likesUser &&
              Props.post.likesUser.includes(Props.currentUserId)
            }
          />
        </div>
      </div>
    </>
  )
}

export default CommentCardWithProfilePic

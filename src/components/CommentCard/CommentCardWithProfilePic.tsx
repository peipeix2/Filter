import { Link } from 'react-router-dom'
import CommentStar from '../Star/CommentStar'
import Tag from '../../components/Tag'
import { FaCommentAlt } from 'react-icons/fa'
import OnSnapShotLikeBtn from '../Like/OnSnapShotLikeBtn'
import parser from 'html-react-parser'

interface PostState {
  id: string
  title?: string
  author: string
  userId: string
  avatar: string
  review?: string
  comment?: string
  comments_count: number
  created_at: any
  isPublic: boolean
  likes_count: number
  movie_id: number
  rating: number
  tags: string[]
  updated_at: Date
  movie_title: string
  movie_original_title: string
  movie_backdrop_path: string
  movie_poster: string
  movie_release: string
  likesUser: string[]
}

interface CommentCardState {
  post: PostState
  currentUserId: string
}

const CommentCardWithProfilePic = (Props: CommentCardState) => {
  return (
    <>
      <div className="comment-card my-5 flex items-start">
        <div className="avatar-wrapper mx-10 mt-5 flex">
          <Link to={`/profile/${Props.post.userId}`}>
            <div
              className="avatar mx-auto h-10 w-10 rounded-full bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${Props.post.avatar})`,
              }}
            />
          </Link>
        </div>
        <div className="comment-rating w-2/3">
          <Link to={`/comment/${Props.post.userId}/${Props.post.id}`}>
            {Props.post.review && (
              <h1 className="mb-5 font-bold">{Props.post.title}</h1>
            )}
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
                <span className="ml-1 text-sm">
                  {Props.post.comments_count}
                </span>
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
            postCategory="COMMENTS"
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

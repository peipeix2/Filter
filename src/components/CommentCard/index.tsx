import { Link } from 'react-router-dom'
import { Image, Divider } from '@nextui-org/react'
import ChangeLocalStateLikeBtn from '../Like/ChangeLocalStateLikeBtn'
import Tag from '../Tag'
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt } from 'react-icons/fa'
import parser from 'html-react-parser'
import { PostState, CommentState, ReviewState } from '../../utils/type'

interface CommentCardState {
  post: PostState
  followingUsersComments: CommentState[] | ReviewState[]
  setFollowingUsersComments: (value: any) => void
  currentUserId: string
}

const CommentCard = (Props: CommentCardState) => {
  return (
    <div className="comment-card-wrapper">
      <div className="comment-card my-5 flex items-center">
        <Link to={`/movies/${Props.post.movie_id}`}>
          <div className="avatar-wrapper flex w-[100px] items-start">
            <Image
              src={`https://image.tmdb.org/t/p/w500${Props.post.movie_poster}`}
              alt={Props.post.movie_original_title}
              isBlurred
            />
          </div>
        </Link>
        <div className="comment-rating ml-10 w-2/3">
          <Link to={`/movies/${Props.post.movie_id}`}>
            <div className="movie-info-header mb-2 flex flex-col items-baseline hover:text-[#89a9a6] lg:flex-row">
              <h1 className="mr-2 text-base font-semibold lg:text-lg">
                {Props.post.movie_title}
              </h1>
              <span className="text-xs lg:text-sm">
                {Props.post.movie_original_title}
              </span>
            </div>
          </Link>
          <Link
            to={`/comment/${Props.post.userId}/${Props.post.id}`}
            className="w-full"
          >
            <div className="comment-header flex flex-col-reverse  lg:flex-row lg:items-center">
              {Props.post.userId !== Props.currentUserId ? (
                <div className="author-date-wrapper flex flex-col xl:flex-row">
                  <div className="comment-user mr-2 flex">
                    <span className="mr-1 text-xs text-slate-400">
                      評論作者
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {Props.post.author}
                    </span>
                  </div>

                  <div className="comment-user mr-2 flex">
                    <span className="text-xs font-thin text-slate-800">
                      {Props.post.created_at.toDate().toDateString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="comment-user mr-2 flex">
                  <span className="text-xs font-thin text-slate-800">
                    {Props.post.created_at.toDate().toDateString()}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <CommentStar rating={Props.post.rating} />
                <div className="comment-count ml-2 flex items-center text-slate-400">
                  <FaCommentAlt className="text-xs" />
                  <span className="ml-1 text-sm">
                    {Props.post.comments_count}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <div className="comment-content my-5">
            {Props.post.comment ? (
              <p className="comment break-words text-xs md:text-sm">
                {Props.post.comment}
              </p>
            ) : (
              <p className="comment line-clamp-3 break-words text-sm leading-10">
                {Props.post.review && parser(Props.post.review)}
              </p>
            )}
          </div>

          <div className="tags mb-3">
            <ul className="flex items-center gap-1">
              {Props.post.tags.map((tag: string, index: number) => {
                return <Tag tag={tag} index={index} key={index} />
              })}
            </ul>
          </div>

          <ChangeLocalStateLikeBtn
            postId={Props.post.id}
            postCategory={Props.post.title ? 'REVIEWS' : 'COMMENTS'}
            count={Props.post.likes_count}
            authorId={Props.post.userId}
            isLiked={Props.post.likesUser?.includes(Props.currentUserId)}
            followingUsersComments={Props.followingUsersComments}
            setFollowingUsersComments={Props.setFollowingUsersComments}
          />
        </div>
      </div>
      <Divider />
    </div>
  )
}

export default CommentCard

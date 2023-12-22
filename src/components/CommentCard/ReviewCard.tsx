import { Link } from 'react-router-dom'
import { Image, Divider } from '@nextui-org/react'
import DiscoverLikeReviewBtn from '../Like/DiscoverLikeReviewBtn'
import Tag from '../Tag'
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt } from 'react-icons/fa'
import parser from 'html-react-parser'

interface PostState {
  id: string
  title: string
  author: string
  userId: string
  avatar: string
  review: string
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

interface ReviewCardState {
  post: PostState
  followingUsersReviews: any
  setFollowingUsersReviews: any
  currentUserId: string
}

const ReviewCard = (Props: ReviewCardState) => {
  return (
    <>
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
            <div className="movie-info-header mb-2 flex items-baseline text-lg hover:text-[#89a9a6]">
              <h1 className="mr-2 font-semibold">{Props.post.movie_title}</h1>
              <span className="text-sm">{Props.post.movie_original_title}</span>
            </div>
          </Link>
          <Link
            to={`/read/${Props.post.userId}/${Props.post.id}`}
            className="w-full"
          >
            <div className="comment-header flex items-center">
              <div className="comment-user mr-2 flex">
                <span className="mr-1 text-xs text-slate-400">評論作者</span>
                <span className="text-xs font-semibold text-slate-800">
                  {Props.post.author}
                </span>
              </div>

              <div className="comment-user mr-2 flex">
                {/* <span className="mr-1 text-xs text-slate-400">
                          評論日期
                        </span> */}
                <span className="text-xs font-thin text-slate-800">
                  {Props.post.created_at.toDate().toDateString()}
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

          <div className="comment-content my-5">
            <p className="comment line-clamp-3 break-words text-sm leading-10">
              {parser(Props.post.review)}
            </p>
          </div>

          <div className="tags mb-3">
            <ul className="flex items-center gap-1">
              {Props.post.tags.map((tag: string, index: number) => {
                return <Tag tag={tag} index={index} key={index} />
              })}
            </ul>
          </div>

          <DiscoverLikeReviewBtn
            postId={Props.post.id}
            count={Props.post.likes_count}
            authorId={Props.post.userId}
            isLiked={Props.post.likesUser?.includes(Props.currentUserId)}
            followingUsersReviews={Props.followingUsersReviews}
            setFollowingUsersReviews={Props.setFollowingUsersReviews}
          />
        </div>
      </div>
      <Divider />
    </>
  )
}

export default ReviewCard

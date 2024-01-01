import { Link } from 'react-router-dom'
import { Image } from '@nextui-org/react'
import CommentStar from '../../components/Star/CommentStar'
import { CommentState, ReviewState } from '../../utils/type'

interface PosterPostState {
  post: CommentState | ReviewState
}

const PosterPost = ({ post }: PosterPostState) => {
  return (
    <div
      className="movie-card flex w-[calc(33%-0.3rem)] flex-col gap-3 lg:w-[18%]"
      key={post.id}
    >
      <Link to={`/comment/${post.userId}/${post.id}`}>
        <Image
          src={`https://image.tmdb.org/t/p/w500${post.movie_poster}`}
          alt={post.movie_original_title}
          isBlurred
          className="mb-2 min-h-full min-w-full object-cover"
          style={{ aspectRatio: '2/3' }}
        />
        <CommentStar rating={post.rating} />
      </Link>
    </div>
  )
}

export default PosterPost

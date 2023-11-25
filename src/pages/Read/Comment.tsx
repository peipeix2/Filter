import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getDocs, collectionGroup } from 'firebase/firestore'
import { db } from '../../../firebase'
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt, FaHeart } from 'react-icons/fa'

const Comment = () => {
  const [comment, setComment] = useState<any>([])
  useEffect(() => {
    getMoviesComment()
  }, [])

  const { id } = useParams()
  const { userId } = useParams()

  const getMoviesComment = async () => {
    const querySnapshot = await getDocs(collectionGroup(db, 'COMMENTS'))
    querySnapshot.forEach((doc) => {
      if (doc.id === id) {
        setComment(doc.data())
      }
    })
  }

  if (!comment) return null

  return (
    <>
      <div
        style={{
          backgroundImage: `url('https://image.tmdb.org/t/p/original/${comment.movie_backdrop_path}')`,
        }}
        className="w-100% h-[500px] bg-cover bg-center bg-no-repeat"
      />
      <h1>{comment.movie_title}</h1>
      <span>{comment.movie_original_title}</span>
      <div className="comment-card mx-auto my-5 flex w-2/3 items-center">
        <div className="avatar-wrapper flex">
          <div
            className="avatar mx-10 h-10 w-10 rounded-full bg-contain"
            style={{
              backgroundImage: `url(${comment.avatar})`,
            }}
          />
        </div>
        <div className="comment-rating flex-grow">
          <h1 className="mb-5 font-bold">{comment.title}</h1>

          <div className="comment-header flex">
            <div className="comment-user mr-2 flex">
              <span className="mr-1 text-sm text-slate-400">評論作者</span>
              <span className="text-sm font-semibold text-slate-800">
                {comment.author}
              </span>
            </div>
            <CommentStar rating={comment.rating} />
            <div className="comment-count ml-2 flex items-center">
              <FaCommentAlt className="text-xs" />
              <span className="ml-1 text-sm">{comment.comments_count}</span>
            </div>
          </div>

          <div className="comment-content my-5">
            <p className="leading-10">{comment.comment}</p>
          </div>

          <div className="like">
            <div className="like-btn flex items-center">
              <FaHeart className="mr-1 text-xs text-slate-800" />
              <span className="mr-2 text-xs text-slate-800">點讚評論</span>
              <span className="text-xs text-slate-500">
                {comment.likes_count} 個人點讚
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Comment

import { useEffect } from 'react'
import { Divider } from '@nextui-org/react'
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt } from 'react-icons/fa'
import { onSnapshot, collectionGroup } from 'firebase/firestore'
import { db } from '../../../firebase'
// import useMoviesDetailStore from '../../store/moviesDetailStore'
import useMoviesCommentStore from '../../store/moviesCommentStore'
import { useParams, Link } from 'react-router-dom'
import { renderComments, isUserCommented } from '../../utils/render'
import useUserStore from '../../store/userStore'
import CommentLikeBtn from '../../components/Like/CommentLikeBtn'
import Tag from '../../components/Tag'

const CommentsSection = () => {
  const moviesCommentsForId = useMoviesCommentStore(
    (state) => state.moviesCommentsForId
  )
  const setMoviesCommentsForId = useMoviesCommentStore(
    (state) => state.setMoviesCommentsForId
  )
  const { user, setHasCommented } = useUserStore()
  const { id } = useParams()

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collectionGroup(db, 'COMMENTS'),
      (querySnapshot) => {
        const comments: any = []
        querySnapshot.forEach((doc) => {
          const commentsData = doc.data()
          const commentsWithId = { ...commentsData, id: doc.id }
          comments.push(commentsWithId)
        })
        const publicComments = renderComments(comments, Number(id))
        setMoviesCommentsForId(publicComments)
        setHasCommented(isUserCommented(comments, user.userId))
      }
    )

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <>
      <div>
        <h1>熱門評論</h1>
      </div>
      <Divider className="my-4" />
      {moviesCommentsForId.map((comment, index) => {
        return (
          <>
            <div className="comment-card my-5 flex items-start" key={index}>
              <div className="avatar-wrapper mx-10 mt-5 flex">
                <Link to={`/profile/${comment.userId}/activity`}>
                  <div
                    className="avatar mx-auto h-10 w-10 rounded-full bg-contain"
                    style={{
                      backgroundImage: `url(${comment.avatar})`,
                    }}
                  />
                </Link>
              </div>
              <div className="comment-rating w-3/4">
                <Link to={`/comment/${comment.userId}/${comment.id}`}>
                  <div className="comment-header flex">
                    <div className="comment-user mr-2 flex">
                      <span className="mr-1 text-sm text-slate-400">
                        評論作者
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
                        {comment.author}
                      </span>
                    </div>
                    <CommentStar rating={comment.rating} />
                    <div className="comment-count ml-2 flex items-center">
                      <FaCommentAlt className="text-xs" />
                      <span className="ml-1 text-sm">
                        {comment.comments_count}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="comment-content my-5 text-sm">
                  <p className="comment">{comment.comment}</p>
                </div>

                <div className="tags mb-3">
                  <ul className="flex gap-1">
                    {comment.tags.map((tag, index) => {
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
          </>
        )
      })}
    </>
  )
}

export default CommentsSection

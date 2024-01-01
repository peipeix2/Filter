import { useEffect } from 'react'
import { Divider } from '@nextui-org/react'
import { onSnapshot, collectionGroup } from 'firebase/firestore'
import { db } from '../../../firebase'
import useMoviesCommentStore from '../../store/moviesCommentStore'
import { useParams } from 'react-router-dom'
import { filterPublicComments, isUserCommented } from '../../utils/render'
import useUserStore from '../../store/userStore'
import CommentCardWithProfilePic from '../../components/CommentCard/CommentCardWithProfilePic'
import { CommentState } from '../../utils/type'

const CommentsSection = () => {
  const { moviesCommentsForId, setMoviesCommentsForId } =
    useMoviesCommentStore()
  const { user, setHasCommented } = useUserStore()
  const { id } = useParams()

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collectionGroup(db, 'COMMENTS'),
      (querySnapshot) => {
        const comments: CommentState[] = []
        querySnapshot.forEach((doc) => {
          const commentsWithId = { ...doc.data(), id: doc.id }
          comments.push(commentsWithId as CommentState)
        })
        const publicComments = filterPublicComments(comments, Number(id))
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
        <h1 className="text-sm lg:text-base">熱門評論</h1>
      </div>
      <Divider className="my-4" />
      {moviesCommentsForId.map((comment, index) => {
        return (
          <>
            <CommentCardWithProfilePic
              post={comment}
              currentUserId={user.userId}
              key={index}
            />
            <Divider />
          </>
        )
      })}
    </>
  )
}

export default CommentsSection

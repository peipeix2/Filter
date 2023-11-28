import { FaHeart } from 'react-icons/fa'
import { db } from '../../../firebase'
import {
  doc,
  collection,
  setDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import useUserStore from '../../store/userStore'

interface LikeState {
  postId: string
  count: number
  isLiked: boolean
  authorId: string
}

const CommentLikeBtn = (Props: LikeState) => {
  const user = useUserStore((state) => state.user)

  const handleLikeClick = async () => {
    const userRef = doc(db, 'USERS', user.userId)
    const docRef = collection(db, 'USERS')

    if (Props.isLiked) {
      await setDoc(
        userRef,
        { likes: arrayRemove(Props.postId) },
        { merge: true }
      )
      await setDoc(
        doc(docRef, Props.authorId, 'COMMENTS', Props.postId),
        {
          likes_count: Props.count - 1,
          likesUser: arrayRemove(user.userId),
        },
        {
          merge: true,
        }
      )
    } else {
      await setDoc(
        userRef,
        { likes: arrayUnion(Props.postId) },
        { merge: true }
      )
      await setDoc(
        doc(docRef, Props.authorId, 'COMMENTS', Props.postId),
        {
          likes_count: Props.count + 1,
          likesUser: arrayUnion(user.userId),
        },
        {
          merge: true,
        }
      )
    }
  }

  return (
    <div className="like-btn flex items-center">
      <FaHeart
        className={
          Props.isLiked
            ? 'mr-1 text-xs text-red-500'
            : 'mr-1 text-xs text-slate-800'
        }
        onClick={handleLikeClick}
      />
      <span className="mr-2 text-xs text-slate-800">
        {Props.isLiked ? '取消讚' : '點讚'}
      </span>
      <span className="text-xs text-slate-500">{Props.count} 個人點讚</span>
    </div>
  )
}

export default CommentLikeBtn

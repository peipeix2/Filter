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
import toast from 'react-hot-toast'

interface LikeState {
  postId: string
  postCategory: string
  count: number
  isLiked: boolean
  authorId: string
}

const OnSnapShotLikeBtn = (Props: LikeState) => {
  const { user, isLogin } = useUserStore()
  const currentUserId = user.userId

  const handleLikeClick = async (
    isLiked: boolean,
    postCategory: string,
    currentUserId: string,
    postId: string,
    postAuthorId: string,
    likesCount: number
  ) => {
    if (!isLogin) {
      return toast.error('請先登入或註冊！')
    }

    const userRef = doc(db, 'USERS', currentUserId)
    const docRef = collection(db, 'USERS')

    if (isLiked) {
      await setDoc(userRef, { likes: arrayRemove(postId) }, { merge: true })
      await setDoc(
        doc(docRef, postAuthorId, postCategory, postId),
        {
          likes_count: likesCount - 1,
          likesUser: arrayRemove(currentUserId),
        },
        {
          merge: true,
        }
      )
    } else {
      await setDoc(userRef, { likes: arrayUnion(postId) }, { merge: true })
      await setDoc(
        doc(docRef, postAuthorId, postCategory, postId),
        {
          likes_count: likesCount + 1,
          likesUser: arrayUnion(currentUserId),
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
        className={`
          hover:cursor-pointer
          ${
            Props.isLiked
              ? 'mr-1 text-xs text-red-500'
              : 'mr-1 text-xs text-slate-800'
          }
        `}
        onClick={() =>
          handleLikeClick(
            Props.isLiked,
            Props.postCategory,
            currentUserId,
            Props.postId,
            Props.authorId,
            Props.count
          )
        }
      />
      <span className="mr-2 text-xs text-slate-800">
        {Props.isLiked ? '取消讚' : '點讚'}
      </span>
      <span className="text-xs text-slate-500">{Props.count} 個人點讚</span>
    </div>
  )
}

export default OnSnapShotLikeBtn

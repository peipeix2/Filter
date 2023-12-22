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
  count: number
  isLiked: boolean
  authorId: string
  followingUsersReviews: any
  setFollowingUsersReviews: any
}

const DiscoverLikeReviewBtn = (Props: LikeState) => {
  const { user, isLogin } = useUserStore()

  const updateLocalLikesUser = (
    followingUsersComments: any,
    postId: string,
    isLiked: boolean,
    count: number
  ) => {
    const updatedComments = [...followingUsersComments]
    const commentIndex = updatedComments.findIndex(
      (comment) => comment.id === postId
    )

    if (commentIndex !== -1) {
      if (isLiked) {
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          likes_count: count - 1,
          likesUser: updatedComments[commentIndex].likesUser.filter(
            (userId: string) => userId !== user.userId
          ),
        }
      } else {
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          likes_count: count + 1,
          likesUser: [...updatedComments[commentIndex].likesUser, user.userId],
        }
      }
    }

    Props.setFollowingUsersReviews(updatedComments)
  }

  const handleLikeClick = async () => {
    if (!isLogin) {
      return toast.error('請先登入或註冊！')
    }

    const userRef = doc(db, 'USERS', user.userId)
    const docRef = collection(db, 'USERS')

    updateLocalLikesUser(
      Props.followingUsersReviews,
      Props.postId,
      Props.isLiked,
      Props.count
    )

    if (Props.isLiked) {
      await setDoc(
        userRef,
        { likes: arrayRemove(Props.postId) },
        { merge: true }
      )
      await setDoc(
        doc(docRef, Props.authorId, 'REVIEWS', Props.postId),
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
        doc(docRef, Props.authorId, 'REVIEWS', Props.postId),
        {
          likes_count: Props.count + 1,
          likesUser: arrayUnion(user.userId),
        },
        {
          merge: true,
        }
      )
    }

    // setLiked(!liked)
  }

  return (
    <div className="like-btn flex items-center" key={Props.count}>
      <FaHeart
        className={`
          hover:cursor-pointer
          ${
            Props.isLiked
              ? 'mr-1 text-xs text-red-500'
              : 'mr-1 text-xs text-slate-800'
          }
        `}
        onClick={handleLikeClick}
      />
      <span className="mr-2 text-xs text-slate-800">
        {Props.isLiked ? '取消讚' : '點讚'}
      </span>
      <span className="text-xs text-slate-500">{Props.count} 個人點讚</span>
    </div>
  )
}

export default DiscoverLikeReviewBtn

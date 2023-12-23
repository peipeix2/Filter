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
  postCategory: string
  count: number
  isLiked: boolean
  authorId: string
  followingUsersComments: any
  setFollowingUsersComments: any
}

const DiscoverLikeBtn = (Props: LikeState) => {
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
          likesUser: updatedComments[commentIndex].likesUser?.filter(
            (userId: string) => userId !== user.userId
          ),
        }
      } else {
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          likes_count: count + 1,
          likesUser: [
            ...(updatedComments[commentIndex].likesUser ?? []),
            user.userId,
          ],
        }
      }
    }

    Props.setFollowingUsersComments(updatedComments)
  }

  const handleLikeClick = async (
    postCategory: string,
    currentUserId: string,
    postId: string,
    authorId: string,
    likesCount: number
  ) => {
    if (!isLogin) {
      return alert('請先登入或註冊！')
    }

    const userRef = doc(db, 'USERS', currentUserId)
    const docRef = collection(db, 'USERS')

    updateLocalLikesUser(
      Props.followingUsersComments,
      Props.postId,
      Props.isLiked,
      Props.count
    )

    if (Props.isLiked) {
      await setDoc(userRef, { likes: arrayRemove(postId) }, { merge: true })
      await setDoc(
        doc(docRef, authorId, postCategory, postId),
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
        doc(docRef, authorId, postCategory, postId),
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
            Props.postCategory,
            user.userId,
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

export default DiscoverLikeBtn

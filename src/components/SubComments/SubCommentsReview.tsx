import { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import {
  collection,
  onSnapshot,
  setDoc,
  addDoc,
  doc,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore'
import { Textarea, Button, Divider } from '@nextui-org/react'
import useUserStore from '../../store/userStore'
import toast from 'react-hot-toast'

interface SubCommentsState {
  commentId: string
  userId: string
}

const SubCommentsReview = (Props: SubCommentsState) => {
  const [subComments, setSubComments] = useState<any>([])
  const [editingComments, setEditingComments] = useState<any>([])
  const [text, setText] = useState<string>('')
  const [editTextMap, setEditTextMap] = useState<any>({})
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    const reviewRef = collection(
      db,
      'USERS',
      Props.userId,
      'REVIEWS',
      Props.commentId,
      'SUBCOMMENTS'
    )
    const unsubscribe = onSnapshot(reviewRef, (querySnapshot) => {
      const subCommentsData: any = []
      querySnapshot.forEach((doc) => {
        subCommentsData.push({ ...doc.data(), id: doc.id })
      })
      const subCommentsDataSorted = subCommentsData.sort(
        (a: any, b: any) => a.created_at - b.created_at
      )
      setSubComments(subCommentsDataSorted)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handlePostComment = async () => {
    if (!text || text?.trim().length === 0) {
      toast.error('評論不得為空')
      return
    }

    const subCommentRef = collection(
      db,
      'USERS',
      Props.userId,
      'REVIEWS',
      Props.commentId,
      'SUBCOMMENTS'
    )
    const commentRef = doc(
      db,
      'USERS',
      Props.userId,
      'REVIEWS',
      Props.commentId
    )

    const postSubCommentData = {
      userId: user.userId,
      username: user.username,
      subcomment: text,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      comment_id: Props.commentId,
    }

    try {
      await addDoc(subCommentRef, postSubCommentData)
      await setDoc(
        commentRef,
        { comments_count: subComments.length + 1 },
        { merge: true }
      )
      console.log('Add subComment successfully.')
      setText('')
    } catch (err) {
      console.log('Error', err)
    }
  }

  const handleEditComment = async (
    subCommentId: string,
    subCommentBody: string
  ) => {
    if (editingComments.includes(subCommentId)) {
      setEditingComments((prev: any) =>
        prev.filter((id: string) => id !== subCommentId)
      )
    } else {
      setEditingComments((prev: any) => [...prev, subCommentId])
    }
    setEditTextMap((prev: any) => ({ ...prev, [subCommentId]: subCommentBody }))
  }

  const handleUpdateComment = async (subCommentId: string) => {
    const subCommentRef = doc(
      db,
      'USERS',
      Props.userId,
      'REVIEWS',
      Props.commentId,
      'SUBCOMMENTS',
      subCommentId
    )

    try {
      await setDoc(
        subCommentRef,
        {
          subcomment: editTextMap[subCommentId],
          updated_at: serverTimestamp(),
        },
        { merge: true }
      )
      setEditingComments((prev: any) =>
        prev.filter((id: string) => id !== subCommentId)
      )
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteComment = async (subCommentId: string) => {
    const subCommentRef = doc(
      db,
      'USERS',
      Props.userId,
      'REVIEWS',
      Props.commentId,
      'SUBCOMMENTS',
      subCommentId
    )
    const commentRef = doc(
      db,
      'USERS',
      Props.userId,
      'REVIEWS',
      Props.commentId
    )

    try {
      await deleteDoc(subCommentRef)
      await setDoc(
        commentRef,
        { comments_count: subComments.length - 1 },
        { merge: true }
      )
    } catch (err) {
      console.log('Error', err)
    }
  }

  if (!subComments) return

  return (
    <div className="w-full">
      {subComments.map((subComment: any, index: number) => {
        return (
          <div className="subComment-card my-5" key={index}>
            <div className="header flex items-center gap-2">
              <span className="font-bold">{subComment.username}</span>
              <span className="text-sm text-slate-400">
                {subComment.created_at?.toDate().toDateString()}
              </span>
            </div>

            {editingComments.includes(subComment.id) ? (
              <div className="flex flex-col">
                <Textarea
                  value={editTextMap[subComment.id]}
                  onChange={(e) =>
                    setEditTextMap((prev: any) => ({
                      ...prev,
                      [subComment.id]: e.target.value,
                    }))
                  }
                />
                <div className="flex w-full justify-end">
                  <Button
                    className="mt-2"
                    size="sm"
                    onClick={() => handleUpdateComment(subComment.id)}
                  >
                    更新
                  </Button>
                </div>
              </div>
            ) : (
              <div className="comment-body mb-10 text-right">
                {subComment.subcomment}
              </div>
            )}
            {user.userId === subComment.userId && (
              <div className="my-3 flex justify-end gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    handleEditComment(subComment.id, subComment.subcomment)
                  }
                >
                  {editingComments.includes(subComment.id)
                    ? '取消編輯'
                    : '編輯'}
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => handleDeleteComment(subComment.id)}
                >
                  刪除
                </Button>
              </div>
            )}
            <Divider />
          </div>
        )
      })}
      <div className="flex flex-col">
        <Textarea value={text} onChange={(e) => setText(e.target.value)} />
        <Button className="mt-2" onClick={handlePostComment}>
          送出
        </Button>
      </div>
    </div>
  )
}

export default SubCommentsReview

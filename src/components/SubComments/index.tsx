import { useState, useEffect } from "react"
import { db } from "../../../firebase"
import { collection, onSnapshot, setDoc, addDoc, doc, serverTimestamp, deleteDoc } from "firebase/firestore"
import { Textarea, Button, Divider } from '@nextui-org/react'
import useUserStore from "../../store/userStore"

interface SubCommentsState {
  commentId: string,
  userId: string
}

const SubComments = (Props: SubCommentsState) => {
  const [subComments, setSubComments] = useState<any>([])
  const [text, setText] = useState<string>('')
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    const commentRef = collection(db, "USERS", Props.userId, "COMMENTS", Props.commentId, "SUBCOMMENTS")
    const unsubscribe = onSnapshot(commentRef, (querySnapshot) => {
      const subCommentsData:any = []
      querySnapshot.forEach((doc) => {
        subCommentsData.push({...doc.data(), id: doc.id})
      })
      const subCommentsDataSorted = subCommentsData.sort((a:any,b:any) => a.created_at - b.created_at)
      setSubComments(subCommentsDataSorted)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handlePostComment = async() => {
    if (!text || text?.trim().length === 0) {
      alert('評論不得為空')
      return
    }

    const subCommentRef = collection(db, "USERS", Props.userId, "COMMENTS", Props.commentId, "SUBCOMMENTS")
    const commentRef = doc(db, 'USERS', Props.userId, 'COMMENTS', Props.commentId)

    const postSubCommentData = {
      userId: user.userId,
      username: user.username,
      subcomment: text,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      comment_id: Props.commentId
    }

    try {
      await addDoc(subCommentRef, postSubCommentData)
      await setDoc(commentRef, {comments_count: subComments.length + 1}, { merge: true })
      console.log('Add subComment successfully.')
      setText('')
    } catch (err) {
      console.log('Error', err)
    }
    
  }

  const handleDeleteComment = async (subCommentId:string) => {
    const subCommentRef = doc(db, "USERS", Props.userId, "COMMENTS", Props.commentId, "SUBCOMMENTS", subCommentId)
    const commentRef = doc(db, 'USERS', Props.userId, 'COMMENTS', Props.commentId)

    try {
      await deleteDoc(subCommentRef)
      await setDoc(commentRef, {comments_count: subComments.length - 1}, { merge: true })
    } catch (err) {
      console.log('Error', err)
    }
  }

  if(!subComments) return

  return (
    <div className="w-full">
      {subComments.map((subComment: any) => {
        return (
          <div className="subComment-card my-5">
            <div className="header flex gap-2">
              <span className="font-bold">{subComment.username}</span>
              <span>{subComment.created_at?.toDate().toDateString()}</span>
            </div>
            <div className="comment-body text-right">
              {subComment.subcomment}
            </div>
            {user.userId === subComment.userId && (
              <div className="mt-3 text-right">
                <Button>編輯</Button>
                <Button onClick={() => handleDeleteComment(subComment.id)}>刪除</Button>
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

export default SubComments
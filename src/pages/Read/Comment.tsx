import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  getDocs,
  collectionGroup,
  serverTimestamp,
  getDoc,
  setDoc,
  doc,
  deleteDoc, onSnapshot, 
} from 'firebase/firestore'
import { db } from '../../../firebase'
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt } from 'react-icons/fa'
import useUserStore from '../../store/userStore'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Image,
  Textarea,
} from '@nextui-org/react'
import TagsInput from '../../components/TagsInput'
import { FaStar } from 'react-icons/fa'
import useMoviesCommentStore from '../../store/moviesCommentStore'
import { useNavigate } from 'react-router-dom'
import CommentLikeBtn from '../../components/Like/CommentLikeBtn'
import SubComments from '../../components/SubComments'

const Comment = () => {
  const [comment, setComment] = useState<any>([])
  const { revisedMoviesComment, setRevisedMoviesComment } = useMoviesCommentStore()
  const [moviesData, setMoviesData] = useState<any>([])
  const [hover, setHover] = useState<number | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagsInput, setTagsInput] = useState<string>('')
  const user = useUserStore((state) => state.user)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const navigate = useNavigate()

  useEffect(() => {
    // getMoviesComment()
    const unsubscribe = onSnapshot(
      collectionGroup(db, 'COMMENTS'),
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.id === id) {
            setComment(doc.data())
            setTags(doc.data().tags)
            setRevisedMoviesComment('comment', doc.data().comment)
          }
        })
      }
    )

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (comment) {
      getMoviesDetail(comment.movie_id)
    }
  }, [comment])

  const { id } = useParams()
  const { userId } = useParams()

  if (!id) return
  if (!userId) return

  const getMoviesDetail = async (movieId:any) => {
    const movieRef = doc(db, 'MOVIES', String(movieId))
    const docSnap = await getDoc(movieRef)
    if(docSnap.exists()) {
      const movieInfo = docSnap.data()
      setMoviesData(movieInfo)
    }
  }

  const handleSubmitComment = async () => {
    if (!revisedMoviesComment.rating) {
      window.alert('請填寫評分！')
      return
    }

    const commentData = {
      ...revisedMoviesComment,
      tags: tags,
      updated_at: serverTimestamp(),
    }

    try {
      const userRef = doc(db, 'USERS', userId, 'COMMENTS', id)
      setDoc(userRef, commentData, { merge: true })
      await updateMovieRatings()
      navigate(`/movies/${comment.movie_id}`)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  const updateMovieRatings = async () => {
    try {
      await setDoc(
        doc(db, 'MOVIES', `${comment.movie_id}`),
        {
          rating: ((moviesData.rating * moviesData.ratings_count) - comment.rating + revisedMoviesComment.rating) / moviesData.ratings_count,
        },
        { merge: true }
      )
      console.log('Movie ratings updated successfully.')
    } catch (error) {
      console.error('Error updating movie ratings: ', error)
    }
  }

  const handleDeleteComment = async () => {
    try {
      const userRef = doc(db, 'USERS', userId, 'COMMENTS', id)
      await deleteDoc(userRef)
      await updateDeleteMovieRatings()
      alert('評論已刪除！')
      navigate(`/movies/${comment.movie_id}`)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  const updateDeleteMovieRatings = async () => {
    try {
      await setDoc(
        doc(db, 'MOVIES', `${comment.movie_id}`),
        {
          rating:
            (moviesData.rating * moviesData.ratings_count - comment.rating) /
            (moviesData.ratings_count - 1),
          ratings_count: moviesData.ratings_count - 1
        },
        { merge: true }
      )
      console.log('Movie ratings updated successfully.')
    } catch (error) {
      console.error('Error updating movie ratings: ', error)
    }
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
            <CommentLikeBtn
              postId={id}
              authorId={comment.userId}
              count={comment.likes_count}
              isLiked={
                comment.likesUser && comment.likesUser.includes(user.userId)
              }
            />
          </div>

          {comment.userId === user.userId && (
            <div className="flex gap-2">
              <button onClick={onOpen}>修改</button>
              <button onClick={handleDeleteComment}>刪除</button>
            </div>
          )}

          {/* Modal Form */}
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            size="5xl"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    我看過...
                  </ModalHeader>
                  <ModalBody className="flex flex-row">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${comment.movie_poster}`}
                      alt={comment.movie_original_title}
                      className="w-[300px]"
                      isBlurred
                    />
                    <div className="flex-grow px-10">
                      <h1 className="mr-2 text-3xl font-bold">
                        {comment.movie_title}
                      </h1>
                      <p className="mb-5 font-['DM_Serif_Display'] text-2xl">
                        {comment.movie_original_title}
                      </p>
                      <Textarea
                        variant="flat"
                        label="我的評價"
                        description="字數不可超過150字"
                        className="mb-5"
                        maxLength={150}
                        value={revisedMoviesComment.comment}
                        onChange={(e) =>
                          setRevisedMoviesComment('comment', e.target.value)
                        }
                      />

                      <TagsInput
                        tags={tags}
                        setTags={setTags}
                        tagsInput={tagsInput}
                        setTagsInput={setTagsInput}
                      />

                      <div className="rating-privacy mt-5 flex justify-between">
                        <div className="flex items-center">
                          <span className="mx-2 text-sm">評分</span>
                          {[...Array(5)].map((_, index) => {
                            const ratingValue: number = index + 1
                            return (
                              <label key={index}>
                                <input
                                  className="hidden"
                                  type="radio"
                                  name="score"
                                  id="score"
                                  value={ratingValue}
                                  onClick={() =>
                                    setRevisedMoviesComment(
                                      'rating',
                                      ratingValue
                                    )
                                  }
                                />
                                <FaStar
                                  size={30}
                                  color={
                                    ratingValue <=
                                    (hover || revisedMoviesComment.rating)
                                      ? 'orange'
                                      : '#e4e5e9'
                                  }
                                  onMouseEnter={() => setHover(ratingValue)}
                                  onMouseLeave={() => setHover(null)}
                                />
                              </label>
                            )
                          })}
                        </div>

                        <div className="flex justify-between px-1 py-2">
                          <span className="mr-2">隱私設定</span>
                          <Checkbox
                            classNames={{
                              label: 'text-small',
                            }}
                            isSelected={!comment.isPublic}
                            onChange={(e) =>
                              setRevisedMoviesComment(
                                'isPublic',
                                !e.target.checked
                              )
                            }
                          >
                            不公開
                          </Checkbox>
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="primary"
                      onPress={onClose}
                      onClick={handleSubmitComment}
                    >
                      送出
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>

      <div className="comments-section mx-auto my-5 flex w-2/3 items-center">
        <SubComments
          commentId={id}
          userId={userId}
        />
      </div>
    </>
  )
}

export default Comment

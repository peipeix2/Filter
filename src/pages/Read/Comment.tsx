import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  collectionGroup,
  serverTimestamp,
  setDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../../../firebase'
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
  Divider,
} from '@nextui-org/react'
import TagsInput from '../../components/TagsInput'
import { FaStar } from 'react-icons/fa'
import useMoviesCommentStore from '../../store/moviesCommentStore'
import { useNavigate } from 'react-router-dom'
import SubComments from '../../components/SubComments'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import CommentCardWithProfilePic from '../../components/CommentCard/CommentCardWithProfilePic'
import { CommentState, MovieFromFirestoreState } from '../../utils/type'
import {
  updateDeleteMovieRatings,
  updateMovieRatings,
} from '../../utils/render'
import firestore from '../../utils/firestore'

const Comment = () => {
  const [comment, setComment] = useState<CommentState | null>(null)
  const { revisedMoviesComment, setRevisedMoviesComment } =
    useMoviesCommentStore()
  const [moviesData, setMoviesData] = useState<MovieFromFirestoreState | null>(
    null
  )
  const [hover, setHover] = useState<number | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagsInput, setTagsInput] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const user = useUserStore((state) => state.user)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const navigate = useNavigate()

  const { id } = useParams()
  const { userId } = useParams()

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collectionGroup(db, 'COMMENTS'),
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.id === id) {
            setComment(doc.data() as CommentState)
            setTags(doc.data().tags)
            setRevisedMoviesComment('comment', doc.data().comment)
            setRevisedMoviesComment('rating', doc.data().rating || 0)
            setHover(doc.data().rating || 0)
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

  if (!id) return
  if (!userId) return

  const getMoviesDetail = async (movieId: number) => {
    const docSnap = await firestore.getDoc('MOVIES', String(movieId))
    if (docSnap) {
      setMoviesData(docSnap as MovieFromFirestoreState)
    }
  }

  const handleSubmitComment = async () => {
    if (!revisedMoviesComment.rating) {
      toast.error('請填寫評分！')
      return
    }

    if (!comment || !moviesData) return

    const commentData = {
      ...revisedMoviesComment,
      tags: tags,
      updated_at: serverTimestamp(),
    }

    try {
      const userRef = doc(db, 'USERS', userId, 'COMMENTS', id)
      setDoc(userRef, commentData, { merge: true })
      await updateMovieRatings(comment, moviesData, revisedMoviesComment)
      if (comment?.movie_id) {
        navigate(`/movies/${comment.movie_id}`)
      }
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  const handleDeleteComment = async () => {
    if (!comment) return
    if (!moviesData) return
    try {
      setIsLoading(true)
      const userRef = doc(db, 'USERS', userId, 'COMMENTS', id)
      await deleteDoc(userRef)
      await updateDeleteMovieRatings(comment, moviesData)
      setIsLoading(false)
      toast.success('評論已刪除！')
      navigate(`/movies/${comment.movie_id}`)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  if (!comment) return null

  return (
    <>
      <div
        style={{
          backgroundImage: `url('https://image.tmdb.org/t/p/original/${comment.movie_backdrop_path}')`,
        }}
        className="w-100% hidden h-[500px] bg-cover bg-fixed bg-center bg-no-repeat lg:block"
      />

      <div className="container mx-auto mb-20 w-4/5 lg:w-2/5">
        <div className="title-container my-20 text-center">
          <Link
            to={`/movies/${comment.movie_id}`}
            className="hover:text-[#89a9a6]"
          >
            <h1 className="mr-2 text-lg font-bold lg:text-2xl">
              {comment.movie_title}
            </h1>
            <span className="font-['DM_Serif_Display'] text-sm lg:text-xl">
              {comment.movie_original_title}
            </span>
          </Link>
          <Divider />
        </div>

        <CommentCardWithProfilePic post={comment} currentUserId={user.userId} />
        {comment.userId === user.userId && (
          <div className="mt-2 flex w-full justify-end gap-2">
            <Button
              size="sm"
              className="bg-[#94a3ab] text-white"
              onClick={onOpen}
            >
              修改
            </Button>
            <Button
              size="sm"
              className="border-2 border-[#94a3ab] bg-white text-[#94a3ab]"
              onClick={handleDeleteComment}
              isLoading={isLoading}
            >
              刪除
            </Button>
          </div>
        )}
      </div>

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
              <ModalHeader className="flex flex-col gap-1 text-sm lg:text-lg">
                我看過...
              </ModalHeader>
              <ModalBody className="flex flex-col lg:flex-row">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${comment.movie_poster}`}
                  alt={comment.movie_original_title}
                  className="hidden lg:block lg:w-[300px]"
                  isBlurred
                />
                <div className="flex-grow px-10">
                  <h1 className="mr-2 text-xl font-bold lg:text-3xl">
                    {comment.movie_title}
                  </h1>
                  <p className="mb-5 font-['DM_Serif_Display'] text-base lg:text-2xl">
                    {comment.movie_original_title}
                  </p>
                  <Textarea
                    variant="flat"
                    label="我的評價"
                    description="字數不可超過150字"
                    className="mb-5"
                    classNames={{
                      label: 'text-xs lg:text-base',
                      description: 'text-xs lg:text-base',
                    }}
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

                  <div className="rating-privacy mt-5 flex flex-col justify-between lg:flex-row">
                    <div className="flex items-center">
                      <span className="mr-2 text-sm lg:ml-2 lg:text-sm">
                        評分
                      </span>
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
                                setRevisedMoviesComment('rating', ratingValue)
                              }
                            />
                            <FaStar
                              size={30}
                              color={
                                ratingValue <=
                                (hover || revisedMoviesComment.rating)
                                  ? '#f46854'
                                  : '#e4e5e9'
                              }
                              onMouseEnter={() => setHover(ratingValue)}
                              onMouseLeave={() => setHover(null)}
                            />
                          </label>
                        )
                      })}
                    </div>

                    <div className="mt-5 flex justify-start lg:mt-0 lg:justify-between lg:px-1 lg:py-2">
                      <span className="mr-2 text-sm lg:text-base">
                        隱私設定
                      </span>
                      <Checkbox
                        classNames={{
                          label: 'text-small',
                        }}
                        isSelected={!comment.isPublic}
                        onChange={(e) =>
                          setRevisedMoviesComment('isPublic', !e.target.checked)
                        }
                      >
                        不公開
                      </Checkbox>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="border-2 border-[#94a3ab] bg-white text-[#94a3ab]"
                  variant="flat"
                  onPress={onClose}
                >
                  取消
                </Button>
                <Button
                  className="bg-[#94a3ab] text-white"
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

      <div className="mx-auto flex w-4/5 lg:w-2/5 lg:justify-end">
        <div className="comments-section mb-10 flex w-full flex-col items-center lg:w-[70%]">
          <div className="title-wrapper mb-10 w-full text-left">
            <p className="text-sm font-semibold text-[#475565] lg:text-base">
              留言區
            </p>
            <Divider />
          </div>
          <SubComments commentId={id} userId={userId} />
        </div>
      </div>
    </>
  )
}

export default Comment

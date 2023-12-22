import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  collectionGroup,
  serverTimestamp,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
  onSnapshot,
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
  Divider,
} from '@nextui-org/react'
import TagsInput from '../../components/TagsInput'
import { FaStar } from 'react-icons/fa'
import useMoviesCommentStore from '../../store/moviesCommentStore'
import { useNavigate } from 'react-router-dom'
import CommentLikeBtn from '../../components/Like/CommentLikeBtn'
import SubComments from '../../components/SubComments'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import Tag from '../../components/Tag'

const Comment = () => {
  const [comment, setComment] = useState<any>([])
  const { revisedMoviesComment, setRevisedMoviesComment } =
    useMoviesCommentStore()
  const [moviesData, setMoviesData] = useState<any>([])
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
            setComment(doc.data())
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

  const getMoviesDetail = async (movieId: any) => {
    const movieRef = doc(db, 'MOVIES', String(movieId))
    const docSnap = await getDoc(movieRef)
    if (docSnap.exists()) {
      const movieInfo = docSnap.data()
      setMoviesData(movieInfo)
    }
  }

  const handleSubmitComment = async () => {
    if (!revisedMoviesComment.rating) {
      toast.error('請填寫評分！')
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
          rating:
            (moviesData.rating * moviesData.ratings_count -
              comment.rating +
              revisedMoviesComment.rating) /
            moviesData.ratings_count,
        },
        { merge: true }
      )
    } catch (error) {
      console.error('Error updating movie ratings: ', error)
    }
  }

  const handleDeleteComment = async () => {
    try {
      setIsLoading(true)
      const userRef = doc(db, 'USERS', userId, 'COMMENTS', id)
      await deleteDoc(userRef)
      await updateDeleteMovieRatings()
      setIsLoading(false)
      toast.success('評論已刪除！')
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
            moviesData.ratings_count - 1 === 0
              ? 0
              : (moviesData.rating * moviesData.ratings_count -
                  comment.rating) /
                (moviesData.ratings_count - 1),
          ratings_count: moviesData.ratings_count - 1,
        },
        { merge: true }
      )
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
        className="w-100% h-[500px] bg-cover bg-fixed bg-center bg-no-repeat"
      />

      <div className="container mx-auto mb-20 w-2/5">
        <div className="title-container my-20 text-center">
          <Link
            to={`/movies/${comment.movie_id}`}
            className="hover:text-[#89a9a6]"
          >
            <h1 className="mr-2 text-2xl font-bold">{comment.movie_title}</h1>
            <span className="font-['DM_Serif_Display'] text-xl">
              {comment.movie_original_title}
            </span>
          </Link>
          <Divider />
        </div>

        <div className="comment-card mx-auto my-5 flex items-start">
          <Link
            to={`/profile/${comment.userId}`}
            className="avatar-wrapper mt-5 flex w-1/4"
          >
            <div
              className="avatar mx-10 h-10 w-10 rounded-full bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${comment.avatar})`,
              }}
            />
          </Link>
          <div className="comment-content-btn-container mx-auto flex w-3/4 flex-col items-start">
            <div className="comment-rating w-full">
              <h1 className="mb-5 font-bold">{comment.title}</h1>

              <div className="comment-header flex">
                <div className="comment-user mr-2 flex">
                  <span className="mr-1 text-sm text-slate-400">評論作者</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {comment.author}
                  </span>
                </div>
                <CommentStar rating={comment.rating} />
                <div className="comment-count ml-2 flex items-center text-slate-400">
                  <FaCommentAlt className="text-xs" />
                  <span className="ml-1 text-sm">{comment.comments_count}</span>
                </div>
              </div>

              <div className="comment-content my-5">
                <p className="break-words leading-10">{comment.comment}</p>
              </div>

              <div className="tags mb-3">
                <ul className="flex gap-1">
                  {comment.tags?.map((tag: string, index: number) => {
                    return <Tag tag={tag} index={index} />
                  })}
                </ul>
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
            </div>
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
        </div>
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

                    <div className="flex justify-between px-1 py-2">
                      <span className="mr-2">隱私設定</span>
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

      <div className="mx-auto flex w-2/5 justify-end">
        <div className="comments-section mb-10 flex w-[70%] flex-col items-center">
          <div className="title-wrapper mb-10 w-full text-left">
            <p className="text-base font-semibold text-[#475565]">留言區</p>
            <Divider />
          </div>
          <SubComments commentId={id} userId={userId} />
        </div>
      </div>
    </>
  )
}

export default Comment

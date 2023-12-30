import { useState, useEffect } from 'react'
import {
  Divider,
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
import { IoEyeOutline } from 'react-icons/io5'
import SimplisticStar from '../../components/Star/SimplisticStar'
import { FaStar } from 'react-icons/fa'
import useMoviesDetailStore from '../../store/moviesDetailStore'
import useMoviesCommentStore from '../../store/moviesCommentStore'
import useMoviesReviewStore from '../../store/moviesReviewStore'
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../../../firebase'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import TagsInput from '../../components/TagsInput'
import useUserStore from '../../store/userStore'
import { isMovieCommented, countRating } from '../../utils/render'
import Favorites from '../../components/Favorites'
import toast from 'react-hot-toast'
import { MovieFromFirestoreState, CommentState } from '../../utils/type'
import { IoIosJournal } from 'react-icons/io'

const RatingPanel = () => {
  const [hover, setHover] = useState<number | null>(null)
  const [moviesData, setMoviesData] = useState<MovieFromFirestoreState | null>(
    null
  )
  const [userFavorites, setUserFavorites] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagsInput, setTagsInput] = useState<string>('')
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)
  const {
    moviesComment,
    moviesCommentsForId,
    setMoviesComment,
    resetMoviesComment,
  } = useMoviesCommentStore()
  const moviesReviewsForId = useMoviesReviewStore(
    (state) => state.moviesReviewsForId
  )
  const { id } = useParams()
  const { user, hasCommented, setHasCommented, isLogin } = useUserStore()
  const userId = user.userId

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'MOVIES', `${id}`), (doc) => {
      const movies: MovieFromFirestoreState =
        doc.data() as MovieFromFirestoreState
      if (movies === undefined) return
      setMoviesData(movies)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    const unsubsComments = onSnapshot(
      collection(db, 'USERS', userId, 'COMMENTS'),
      (querySnapshot) => {
        const userComment: CommentState[] = []
        querySnapshot.forEach((doc) => {
          userComment.push(doc.data() as CommentState)
        })
        setHasCommented(isMovieCommented(userComment, Number(id)))
      }
    )

    const unsubsFavorites = onSnapshot(
      collection(db, 'USERS', userId, 'FAVORITES'),
      (querySnapshot) => {
        const favoriteIds: string[] = []
        querySnapshot.forEach((doc) => {
          favoriteIds.push(doc.id)
        })
        setUserFavorites(favoriteIds)
      }
    )

    return () => {
      unsubsComments()
      unsubsFavorites()
    }
  }, [userId, isLogin])

  const handleSubmitComment = async () => {
    if (formInvalid) {
      toast.error('請填寫評分！')
      return
    }

    const commentData = {
      ...moviesComment,
      tags: tags,
      userId: user.userId,
      author: user.username,
      avatar: user.avatar,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      movie_id: moviesDetail.id,
      movie_title: moviesDetail.title,
      movie_original_title: moviesDetail.original_title,
      movie_backdrop_path: moviesDetail.backdrop_path,
      movie_poster: moviesDetail.poster_path,
      movie_release: moviesDetail.release_date,
    }

    try {
      const userRef = collection(db, 'USERS')
      await addDoc(collection(userRef, user.userId, 'COMMENTS'), commentData)
      await resetMoviesComment()
      await updateMovieRatings()
      onClose()
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  const updateMovieRatings = async () => {
    try {
      await setDoc(
        doc(db, 'MOVIES', `${moviesDetail.id}`),
        {
          ratings_count:
            moviesCommentsForId.length + moviesReviewsForId.length + 1,
          rating: countRating(
            moviesCommentsForId,
            moviesReviewsForId,
            moviesComment
          ),
        },
        { merge: true }
      )
    } catch (error) {
      console.error('Error updating movie ratings: ', error)
    }
  }

  const formInvalid = !moviesComment.rating

  if (!moviesData) return
  if (!id) return

  return (
    <div className="rating-data-wrapper relative mx-auto flex max-w-[300px] flex-col-reverse py-3 lg:w-4/5 lg:flex-col lg:bg-slate-100">
      {!isLogin && (
        <div className="protected-wrapper absolute -top-1 z-10 mx-auto h-full w-full bg-slate-800 bg-opacity-50">
          <div className="flex h-full w-full items-center justify-center text-center text-white">
            <p>登入後享受更多功能！</p>
          </div>
        </div>
      )}
      <div className="watched-status flex justify-around pb-3">
        <div
          className={`flex cursor-pointer flex-col items-center hover:text-[#475565] ${
            hasCommented ? 'text-[#f46854]' : 'text-[#94a3ab]'
          }`}
          onClick={hasCommented ? undefined : onOpen}
        >
          <IoEyeOutline className="text-4xl" />
          <span className="text-xs">看過</span>
        </div>
        <Favorites isFavorites={userFavorites.includes(id)} movieId={id} />
        <Link to={`/review/${moviesDetail.id}`} className="lg:hidden">
          <div className="flex cursor-pointer flex-col items-center text-[#94a3ab] hover:text-[#475565] ">
            <IoIosJournal className="text-4xl" />
            <span className="text-xs">寫影評</span>
          </div>
        </Link>
      </div>

      <Divider className="hidden lg:block" />

      <div className="rating-wrapper flex flex-col items-center justify-center py-3">
        <SimplisticStar rating={moviesData.rating} count={1} />
        <p className="mt-2 text-sm text-[#94a3ab]">
          {moviesData.rating?.toFixed(1)}
        </p>
      </div>

      <Divider className="hidden lg:block" />

      <Link to={`/review/${moviesDetail.id}`} className="hidden lg:block">
        <div className="pt-3">
          <p className="text-center text-sm text-[#94a3ab] hover:text-[#475565]">
            寫影評
          </p>
        </div>
      </Link>

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
                  src={`https://image.tmdb.org/t/p/w500${moviesDetail.poster_path}`}
                  alt={moviesDetail.original_title}
                  className="hidden lg:block lg:w-[300px]"
                  isBlurred
                />
                <div className="flex-grow px-10">
                  <h1 className="mr-2 text-xl font-bold lg:text-3xl">
                    {moviesDetail.title}
                  </h1>
                  <p className="mb-5 font-['DM_Serif_Display'] text-base lg:text-2xl">
                    {moviesDetail.original_title}
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
                    value={moviesComment.comment}
                    onChange={(e) =>
                      setMoviesComment('comment', e.target.value)
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
                                setMoviesComment('rating', ratingValue)
                              }
                            />
                            <FaStar
                              size={30}
                              color={
                                ratingValue <= (hover || moviesComment.rating)
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
                        onChange={(e) =>
                          setMoviesComment('isPublic', !e.target.checked)
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
  )
}

export default RatingPanel

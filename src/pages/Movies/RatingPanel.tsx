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
import { isMovieCommented } from '../../utils/render'
import Favorites from '../../components/Favorites'
import toast from 'react-hot-toast'

interface MoviesState {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string
  rating: number
  ratings_count: number
  comments_count: number
  reviews_count: number
  wishes_count: number
  tag: string[]
  release_date: string
}

const RatingPanel = () => {
  const [hover, setHover] = useState<number | null>(null)
  const [moviesData, setMoviesData] = useState<MoviesState | null>(null)
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
      const movies: any = doc.data()
      if (movies === undefined) return
      setMoviesData(movies)
    })

    // if (!user?.userId) return

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    const unsubsComments = onSnapshot(
      collection(db, 'USERS', userId, 'COMMENTS'),
      (querySnapshot) => {
        const userComment: any = []
        querySnapshot.forEach((doc) => {
          userComment.push(doc.data())
        })
        setHasCommented(isMovieCommented(userComment, Number(id)))
      }
    )

    const unsubsFavorites = onSnapshot(
      collection(db, 'USERS', userId, 'FAVORITES'),
      (querySnapshot) => {
        const favoriteIds: any = []
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
          rating: countRating(),
        },
        { merge: true }
      )
    } catch (error) {
      console.error('Error updating movie ratings: ', error)
    }
  }

  const countRating = () => {
    const sumForComments = moviesCommentsForId.reduce(
      (acc, comment) => acc + comment.rating,
      0
    )
    const sumForReviews = moviesReviewsForId.reduce(
      (acc, review) => acc + review.rating,
      0
    )
    const rating =
      (sumForComments + sumForReviews + moviesComment.rating) /
      (moviesCommentsForId.length + moviesReviewsForId.length + 1)
    return rating
  }

  const formInvalid = !moviesComment.rating

  if (!moviesData) return
  if (!id) return

  return (
    <div className="rating-data-wrapper relative mx-auto w-4/5 bg-slate-100 py-3">
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
      </div>

      <Divider />

      <div className="rating-wrapper flex flex-col items-center justify-center py-3">
        <SimplisticStar rating={moviesData.rating} count={1} />
        <p className="mt-2 text-sm text-[#94a3ab]">
          {moviesData.rating?.toFixed(1)}
        </p>
      </div>

      <Divider />

      <Link to={`/review/${moviesDetail.id}`}>
        <div className="py-3">
          <p className="text-center text-sm text-[#94a3ab] hover:text-[#475565]">
            寫影評
          </p>
        </div>
      </Link>

      <Divider />

      <div className="pt-3">
        <p className="text-center text-sm text-[#94a3ab]">分享</p>
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
                  src={`https://image.tmdb.org/t/p/w500${moviesDetail.poster_path}`}
                  alt={moviesDetail.original_title}
                  className="w-[300px]"
                  isBlurred
                />
                <div className="flex-grow px-10">
                  <h1 className="mr-2 text-3xl font-bold">
                    {moviesDetail.title}
                  </h1>
                  <p className="mb-5 font-['DM_Serif_Display'] text-2xl">
                    {moviesDetail.original_title}
                  </p>
                  <Textarea
                    variant="flat"
                    label="我的評價"
                    description="字數不可超過150字"
                    className="mb-5"
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

                    <div className="flex justify-between px-1 py-2">
                      <span className="mr-2">隱私設定</span>
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

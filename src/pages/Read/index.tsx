import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collectionGroup, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../firebase'
import useUserStore from '../../store/userStore'
import SubCommentsReview from '../../components/SubComments/SubCommentsReview'
import { Divider, Button } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ReviewCardforReading from '../../components/CommentCard/ReviewCardforReading'
import { ReviewState, MovieFromFirestoreState } from '../../utils/type'
import { updateDeleteMovieRatings } from '../../utils/render'
import firestore from '../../utils/firestore'

const Read = () => {
  const user = useUserStore((state) => state.user)
  const [moviesData, setMoviesData] = useState<MovieFromFirestoreState | null>(
    null
  )
  const [review, setReview] = useState<ReviewState | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collectionGroup(db, 'REVIEWS'),
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.id === id) {
            setReview({ id: doc.id, ...doc.data() } as ReviewState)
          }
        })
      }
    )
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (review) {
      getMoviesDetail(review.movie_id)
    }
  }, [review])

  const { id } = useParams()
  const { userId } = useParams()
  const navigate = useNavigate()
  if (!id) return
  if (!userId) return

  const getMoviesDetail = async (movieId: number) => {
    const docSnap = await firestore.getDoc('MOVIES', String(movieId))
    if (docSnap) {
      setMoviesData(docSnap as MovieFromFirestoreState)
    }
  }

  const handleDeleteReview = async () => {
    if (!review) return
    if (!moviesData) return

    try {
      setIsLoading(true)
      const userRef = doc(db, 'USERS', userId, 'REVIEWS', id)
      await deleteDoc(userRef)
      await updateDeleteMovieRatings(review, moviesData)
      setIsLoading(false)
      toast.success('評論已刪除！')
      navigate(`/movies/${review.movie_id}`)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  if (!review) return null

  return (
    <>
      <div
        style={{
          backgroundImage: `url('https://image.tmdb.org/t/p/original/${review.movie_backdrop_path}')`,
        }}
        className="w-100% hidden h-[500px] bg-cover bg-fixed bg-center bg-no-repeat lg:block"
      />

      <div className="container mx-auto mb-20 w-4/5 lg:w-2/5">
        <div className="title-container my-20 text-center">
          <Link
            to={`/movies/${review.movie_id}`}
            className="hover:text-[#89a9a6]"
          >
            <h1 className="mr-2 text-lg font-bold lg:text-2xl">
              {review.movie_title}
            </h1>
            <span className="font-['DM_Serif_Display'] text-sm lg:text-xl">
              {review.movie_original_title}
            </span>
          </Link>
          <Divider />
        </div>

        <ReviewCardforReading post={review} currentUserId={user.userId} />

        {review.userId === user.userId && (
          <div className="mt-2 flex w-full justify-end gap-2">
            <Link to={`/review/revision/${id}`}>
              <Button size="sm" className="bg-[#94a3ab] text-white">
                修改
              </Button>
            </Link>
            <Button
              size="sm"
              className="border-2 border-[#94a3ab] bg-white text-[#94a3ab]"
              onClick={handleDeleteReview}
              isLoading={isLoading}
            >
              刪除
            </Button>
          </div>
        )}
      </div>

      <div className="mx-auto flex w-4/5 lg:w-2/5 lg:justify-end">
        <div className="comments-section mb-10 flex w-full flex-col items-center lg:w-[70%]">
          <div className="title-wrapper mb-10 w-full text-left">
            <p className="text-sm font-semibold text-[#475565] lg:text-base">
              留言區
            </p>
            <Divider />
          </div>
          <SubCommentsReview commentId={id} userId={userId} />
        </div>
      </div>
    </>
  )
}

export default Read

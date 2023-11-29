import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collectionGroup, deleteDoc, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../firebase'
import parser from 'html-react-parser'
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt } from 'react-icons/fa'
import useUserStore from '../../store/userStore'
import Like from '../../components/Like'
import SubCommentsReview from '../../components/SubComments/SubCommentsReview'

const Read = () => {
  const user = useUserStore((state) => state.user)
  const [moviesData, setMoviesData] = useState<any>([])
  const [review, setReview] = useState<any>([])

  useEffect(() => {
    // getMoviesReview()
    const unsubscribe = onSnapshot(collectionGroup(db, "REVIEWS"), (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.id === id) {
          setReview(doc.data())
        }
      })
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    getMoviesDetail(review.movie_id)
  }, [review])

  const { id } = useParams()
  const { userId } = useParams()
  const navigate = useNavigate()
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

  const handleDeleteReview = async () => {
    try {
      const userRef = doc(db, 'USERS', userId, 'REVIEWS', id)
      await deleteDoc(userRef)
      await updateDeleteMovieRatings()
      alert('評論已刪除！')
      navigate(`/movies/${review.movie_id}`)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  const updateDeleteMovieRatings = async () => {
    try {
      await setDoc(
        doc(db, 'MOVIES', `${review.movie_id}`),
        {
          rating:
            (moviesData.rating * moviesData.ratings_count - review.rating) /
            (moviesData.ratings_count - 1),
          ratings_count: moviesData.ratings_count - 1,
        },
        { merge: true }
      )
      console.log('Movie ratings updated successfully.')
    } catch (error) {
      console.error('Error updating movie ratings: ', error)
    }
  }

  if (!review) return null

  return (
    <>
      <div
        style={{
          backgroundImage: `url('https://image.tmdb.org/t/p/original/${review.movie_backdrop_path}')`,
        }}
        className="w-100% h-[500px] bg-cover bg-center bg-no-repeat"
      />
      <h1>{review.movie_title}</h1>
      <span>{review.movie_original_title}</span>
      <div className="comment-card mx-auto my-5 flex w-2/3 items-center">
        <div className="avatar-wrapper flex">
          <div
            className="avatar mx-10 h-10 w-10 rounded-full bg-contain"
            style={{
              backgroundImage: `url(${review.avatar})`,
            }}
          />
        </div>
        <div className="comment-rating flex-grow">
          <h1 className="mb-5 font-bold">{review.title}</h1>

          <div className="comment-header flex">
            <div className="comment-user mr-2 flex">
              <span className="mr-1 text-sm text-slate-400">評論作者</span>
              <span className="text-sm font-semibold text-slate-800">
                {review.author}
              </span>
            </div>
            <CommentStar rating={review.rating} />
            <div className="comment-count ml-2 flex items-center">
              <FaCommentAlt className="text-xs" />
              <span className="ml-1 text-sm">{review.comments_count}</span>
            </div>
          </div>

          <div className="comment-content my-5">
            <p className="leading-10">
              {review.review ? parser(review.review) : null}
            </p>
          </div>

          <div className="like">
            <Like
              postId={id}
              isLiked={
                review.likesUser && review.likesUser.includes(user.userId)
              }
              count={review.likes_count}
              authorId={review.userId}
            />
          </div>
        </div>
      </div>

      {review.userId === user.userId && (
        <div className="mx-auto my-5 flex w-2/3 gap-2">
          <a href={`/review/revision/${id}`}>修改</a>
          <button onClick={handleDeleteReview}>刪除</button>
        </div>
      )}

      <div className="mx-auto my-5 flex w-2/3">
        <SubCommentsReview commentId={id} userId={userId} />
      </div>
    </>
  )
}

export default Read

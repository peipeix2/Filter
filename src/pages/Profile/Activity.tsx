import { useEffect } from 'react'
import { db } from '../../../firebase'
import { Image } from '@nextui-org/react'
import { collection, getDocs } from 'firebase/firestore'
import useUserStore from '../../store/userStore'
import { useParams, Link } from 'react-router-dom'
import CommentStar from '../../components/Star/CommentStar'

const Activity = () => {
  const {
    userMoviesComments,
    setUserMoviesComments,
    userMoviesReviews,
    setUserMoviesReviews,
  } = useUserStore()
  const { userId } = useParams()

  if (!userId) return

  useEffect(() => {
    fetchUserComments(userId)
    fetchUserReviews(userId)
  }, [])

  const fetchUserComments = async (userId: string) => {
    const docRef = collection(db, 'USERS', userId, 'COMMENTS')
    const querySnapshot = await getDocs(docRef)
    const comments: any = []
    querySnapshot.forEach((doc) => {
      const commentsData = doc.data()
      const commentsWithId = { ...commentsData, id: doc.id }
      comments.push(commentsWithId)
    })
    setUserMoviesComments(comments)
  }

  const fetchUserReviews = async (userId: string) => {
    const docRef = collection(db, 'USERS', userId, 'REVIEWS')
    const querySnapshot = await getDocs(docRef)
    const reviews: any = []
    querySnapshot.forEach((doc) => {
      const reviewsData = doc.data()
      const reviewsWithId = { ...reviewsData, id: doc.id }
      reviews.push(reviewsWithId)
    })
    setUserMoviesReviews(reviews)
  }

  userMoviesComments.sort((a:any, b:any) => {
    return b.created_at - a.created_at
  })

  userMoviesReviews.sort((a:any, b:any) => {
    return b.created_at - a.created_at
  })

  return (
    <div>
      <div className="mb-5">
        <p className="text-md">評論的電影</p>
      </div>

      <div className="flex gap-2">
        {userMoviesComments.slice(0,5).map((comment) => {
          return (
            <div
              className="movie-card flex w-1/5 flex-col gap-3"
              key={comment.id}
            >
              <Link to={`/comment/${comment.userId}/${comment.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${comment.movie_poster}`}
                  alt={comment.original_title}
                  isBlurred
                />
                <CommentStar rating={comment.rating} />
              </Link>
            </div>
          )
        })}
      </div>

      <div className="mb-5 mt-20">
        <p className="text-md">撰寫的影評</p>
      </div>

      <div className="flex gap-2">
        {userMoviesReviews.slice(0,5).map((review) => {
          return (
            <div
              className="movie-card flex w-1/5 flex-col gap-3"
              key={review.id}
            >
              <Link to={`/read/${review.userId}/${review.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${review.movie_poster}`}
                  alt={review.original_title}
                  isBlurred
                />
                <CommentStar rating={review.rating} />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Activity

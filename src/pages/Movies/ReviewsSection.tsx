import { useEffect } from 'react'
import { Divider } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt, FaHeart } from 'react-icons/fa'
import { collection, query, where, getDocs, collectionGroup } from 'firebase/firestore'
import { db } from '../../../firebase'
// import useMoviesDetailStore from '../../store/moviesDetailStore'
import useMoviesReviewStore from '../../store/moviesReviewStore'
import parser from 'html-react-parser'
import { useParams } from 'react-router-dom'

const ReviewSection = () => {
  // const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)
  const moviesReviewsForId = useMoviesReviewStore(
    (state) => state.moviesReviewsForId
  )
  const setMoviesReviewsForId = useMoviesReviewStore(
    (state) => state.setMoviesReviewsForId
  )
  const { id } = useParams()

  useEffect(() => {
    fetchMovieReviews()
  }, [])

  const fetchMovieReviews = async () => {
    const ref = collectionGroup(db, 'REVIEWS')
    const q = query(ref, where('movie_id', '==', Number(id)))
    const querySnapshot = await getDocs(q)
    const reviewsArray: any = []
    querySnapshot.forEach((doc) => {
      const reviewData = doc.data()
      const reviewWithId = { ...reviewData, id: doc.id }
      reviewsArray.push(reviewWithId)
    })
    setMoviesReviewsForId(reviewsArray)
  }

  return (
    <>
      <div>
        <h1>熱門影評</h1>
      </div>
      <Divider className="my-4" />
      {moviesReviewsForId.map((review, index) => {
        return (
          <>
            <div className="comment-card my-5 flex items-center" key={index}>
              <div className="avatar-wrapper flex">
                <div
                  className="avatar mx-10 h-10 w-10 rounded-full bg-contain"
                  style={{
                    backgroundImage: `url(${review.avatar})`,
                  }}
                />
              </div>
              <div className="comment-rating flex-grow">
                <Link to={`/read/${review.id}`}>
                  <h1 className="mb-5 font-bold">{review.title}</h1>
                </Link>

                <div className="comment-header flex">
                  <div className="comment-user mr-2 flex">
                    <span className="mr-1 text-sm text-slate-400">
                      評論作者
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {review.author}
                    </span>
                  </div>
                  <CommentStar rating={review.rating} />
                  <div className="comment-count ml-2 flex items-center">
                    <FaCommentAlt className="text-xs" />
                    <span className="ml-1 text-sm">
                      {review.comments_count}
                    </span>
                  </div>
                </div>

                <div className="comment-content my-5">
                  <p className="comment line-clamp-3 leading-10">
                    {parser(review.review)}
                  </p>
                </div>

                <div className="tags">
                  <ul className="flex gap-1">
                    {review.tags.map((tag, index) => {
                      return (
                        <li className="p-1 text-sm text-slate-400" key={index}>#{tag}</li>
                      )
                    })}
                  </ul>
                </div>
                <div className="like">
                  <div className="like-btn flex items-center">
                    <FaHeart className="mr-1 text-xs text-slate-800" />
                    <span className="mr-2 text-xs text-slate-800">
                      點讚評論
                    </span>
                    <span className="text-xs text-slate-500">
                      {review.likes_count} 個人點讚
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Divider />
          </>
        )
      })}
    </>
  )
}

export default ReviewSection

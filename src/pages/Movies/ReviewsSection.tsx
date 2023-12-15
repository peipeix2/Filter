import { useEffect } from 'react'
import { Divider } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt } from 'react-icons/fa'
import { query, where, collectionGroup, onSnapshot } from 'firebase/firestore'
import { db } from '../../../firebase'
// import useMoviesDetailStore from '../../store/moviesDetailStore'
import useMoviesReviewStore from '../../store/moviesReviewStore'
import useUserStore from '../../store/userStore'
import parser from 'html-react-parser'
import { useParams } from 'react-router-dom'
import Like from '../../components/Like'
import { renderComments } from '../../utils/render'
import Tag from '../../components/Tag'

const ReviewSection = () => {
  // const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)
  const { moviesReviewsForId, setMoviesReviewsForId } = useMoviesReviewStore()
  const user = useUserStore((state) => state.user)

  const { id } = useParams()

  useEffect(() => {
    const ref = collectionGroup(db, 'REVIEWS')
    const q = query(ref, where('movie_id', '==', Number(id)))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reviewsArray: any = []
      querySnapshot.forEach((doc) => {
        const reviewData = doc.data()
        const reviewWithId = { ...reviewData, id: doc.id }
        reviewsArray.push(reviewWithId)
      })
      const publicComments = renderComments(reviewsArray, Number(id))
      setMoviesReviewsForId(publicComments)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <>
      <div>
        <h1>熱門影評</h1>
      </div>
      <Divider className="my-4" />
      {moviesReviewsForId.map((review, index) => {
        return (
          <>
            <div className="comment-card my-5 flex items-start" key={index}>
              <div className="avatar-wrapper mt-5 flex">
                <div
                  className="avatar mx-10 h-10 w-10 rounded-full bg-cover bg-no-repeat"
                  style={{
                    backgroundImage: `url(${review.avatar})`,
                  }}
                />
              </div>
              <div className="comment-rating w-2/3">
                <Link to={`/read/${review.userId}/${review.id}`}>
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
                  <div className="comment-count ml-2 flex items-center text-slate-400">
                    <FaCommentAlt className="text-xs" />
                    <span className="ml-1 text-sm">
                      {review.comments_count}
                    </span>
                  </div>
                </div>

                <div className="comment-content my-5">
                  <p className="comment line-clamp-3 break-words text-sm leading-10">
                    {parser(review.review)}
                  </p>
                </div>

                <div className="tags mb-3">
                  <ul className="flex gap-1">
                    {review.tags.map((tag, index) => {
                      return <Tag tag={tag} index={index} />
                    })}
                  </ul>
                </div>

                <Like
                  postId={review.id}
                  count={review.likes_count}
                  authorId={review.userId}
                  isLiked={
                    review.likesUser && review.likesUser.includes(user.userId)
                  }
                />
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

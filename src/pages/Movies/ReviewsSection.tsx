import { useEffect } from 'react'
import { Divider } from '@nextui-org/react'
import { query, where, collectionGroup, onSnapshot } from 'firebase/firestore'
import { db } from '../../../firebase'
import useMoviesReviewStore from '../../store/moviesReviewStore'
import useUserStore from '../../store/userStore'
import { useParams } from 'react-router-dom'
import { renderComments } from '../../utils/render'
import ReviewCardWithUserProfilePic from '../../components/CommentCard/ReviewCardWithProfilePic'

const ReviewSection = () => {
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
          <ReviewCardWithUserProfilePic
            post={review}
            currentUserId={user.userId}
            key={index}
          />
        )
      })}
    </>
  )
}

export default ReviewSection

import { useEffect } from 'react'
import { Divider } from '@nextui-org/react'
import { query, where, collectionGroup, onSnapshot } from 'firebase/firestore'
import { db } from '../../../firebase'
import useMoviesReviewStore from '../../store/moviesReviewStore'
import useUserStore from '../../store/userStore'
import { useParams } from 'react-router-dom'
import { filterPublicComments } from '../../utils/render'
import CommentCardWithProfilePic from '../../components/CommentCard/CommentCardWithProfilePic'
import { ReviewState } from '../../utils/type'

const ReviewSection = () => {
  const { moviesReviewsForId, setMoviesReviewsForId } = useMoviesReviewStore()
  const user = useUserStore((state) => state.user)

  const { id } = useParams()

  useEffect(() => {
    const ref = collectionGroup(db, 'REVIEWS')
    const q = query(ref, where('movie_id', '==', Number(id)))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reviewsArray: ReviewState[] = []
      querySnapshot.forEach((doc) => {
        const reviewWithId = { ...doc.data(), id: doc.id }
        reviewsArray.push(reviewWithId as ReviewState)
      })
      const publicComments = filterPublicComments(reviewsArray, Number(id))
      setMoviesReviewsForId(publicComments)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <>
      <div>
        <h1 className="text-sm lg:text-base">熱門影評</h1>
      </div>
      <Divider className="my-4" />
      {moviesReviewsForId.map((review, index) => {
        return (
          <>
            <CommentCardWithProfilePic
              post={review}
              currentUserId={user.userId}
              key={index}
            />
            <Divider />
          </>
        )
      })}
    </>
  )
}

export default ReviewSection

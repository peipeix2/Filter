import { useEffect } from 'react'
import { db } from '../../../firebase'
import { Image, Divider } from '@nextui-org/react'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import useUserStore from '../../store/userStore'
import { useParams, Link } from 'react-router-dom'
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt } from 'react-icons/fa'
import CommentLikeBtn from '../../components/Like/CommentLikeBtn'

const Activity = () => {
  const {
    user,
    userMoviesComments,
    setUserMoviesComments,
    userMoviesReviews,
    setUserMoviesReviews,
  } = useUserStore()
  const { userId } = useParams()

  if (!userId) return

  useEffect(() => {
    // Promise.all([fetchUserComments(userId), fetchUserReviews(userId)])
    const commentDocRef = collection(db, 'USERS', userId, 'COMMENTS')
    const reviewDocRef = collection(db, 'USERS', userId, 'REVIEWS')

    const unsubscribeComments = onSnapshot(commentDocRef, (querySnapshot) => {
      const comments: any = []
      querySnapshot.forEach((doc) => {
        const commentsData = doc.data()
        const commentsWithId = { ...commentsData, id: doc.id }
        comments.push(commentsWithId)
      })
      setUserMoviesComments(comments)
    })

    const unsubscribeReviews = onSnapshot(reviewDocRef, (querySnapshot) => {
      const reviews: any = []
      querySnapshot.forEach((doc) => {
        const reviewsData = doc.data()
        const reviewsWithId = { ...reviewsData, id: doc.id }
        reviews.push(reviewsWithId)
      })
      setUserMoviesReviews(reviews)
    })

    return () => {
      unsubscribeComments()
      unsubscribeReviews()
    }
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

  userMoviesComments.sort((a: any, b: any) => {
    return b.created_at - a.created_at
  })

  userMoviesReviews.sort((a: any, b: any) => {
    return b.created_at - a.created_at
  })

  // Check if this page belongs to login user
  let displayComments
  let displayReviews
  if (user.userId !== userId) {
    displayComments = userMoviesComments.filter(comment => comment.isPublic === true)
    displayReviews = userMoviesReviews.filter(comment => comment.isPublic === true)
  } else {
    displayComments = userMoviesComments
    displayReviews = userMoviesReviews
  }

  return (
    <div>
      <div className="mb-5 flex justify-between">
        <p className="text-md">評論的電影</p>
        {displayComments.length > 5 && <span>More</span>}
      </div>

      <div className="flex gap-2">
        {displayComments.slice(0, 5).map((comment) => {
          return (
            <div
              className="movie-card flex w-1/5 flex-col gap-3"
              key={comment.id}
            >
              <Link to={`/comment/${comment.userId}/${comment.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${comment.movie_poster}`}
                  alt={comment.movie_original_title}
                  isBlurred
                  className='mb-2'
                />
                <CommentStar rating={comment.rating} />
              </Link>
            </div>
          )
        })}
      </div>

      <div className="mb-5 mt-20 flex justify-between">
        <p className="text-md">撰寫的影評</p>
        {displayReviews.length > 5 && <span>More</span>}
      </div>

      <div className="flex gap-2">
        {displayReviews.slice(0, 5).map((review) => {
          return (
            <div
              className="movie-card flex w-1/5 flex-col gap-3"
              key={review.id}
            >
              <Link to={`/read/${review.userId}/${review.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${review.movie_poster}`}
                  alt={review.movie_original_title}
                  isBlurred
                  className="mb-2"
                />
                <CommentStar rating={review.rating} />
              </Link>
            </div>
          )
        })}
      </div>

      <div className="mb-5 mt-20 flex justify-between">
        <p className="text-md">最新評論</p>
      </div>
      
      {
        displayComments.slice(0,3).map((comment:any,index:number) => {
          return (
            <div className="comment-card">
              <>
                <div
                  className="comment-card my-5 flex items-center"
                  key={index}
                >
                  <div className="avatar-wrapper flex w-[100px] items-start">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${comment.movie_poster}`}
                      alt={comment.original_title}
                      isBlurred
                    />
                  </div>
                  <div className="comment-rating ml-10 flex-grow">
                    <div className="movie-info-header mb-2 flex items-baseline text-lg">
                      <h1 className="mr-2 font-bold">{comment.movie_title}</h1>
                      <span className="text-sm">
                        {comment.movie_original_title}
                      </span>
                    </div>
                    <Link to={`/comment/${comment.userId}/${comment.id}`}>
                      <div className="comment-header flex">
                        {comment.userId !== userId ? (
                          <div className="comment-user mr-2 flex">
                            <span className="mr-1 text-sm text-slate-400">
                              評論作者
                            </span>
                            <span className="text-sm font-semibold text-slate-800">
                              {comment.author}
                            </span>
                          </div>
                        ) : (
                          <div className="comment-user mr-2 flex">
                            <span className="mr-1 text-sm text-slate-400">
                              評論日期
                            </span>
                            <span className="text-sm font-semibold text-slate-800">
                              {comment.created_at.toDate().toDateString()}
                            </span>
                          </div>
                        )}
                        <CommentStar rating={comment.rating} />
                        <div className="comment-count ml-2 flex items-center">
                          <FaCommentAlt className="text-xs" />
                          <span className="ml-1 text-sm">
                            {comment.comments_count}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="comment-content my-5">
                      <p className="comment">{comment.comment}</p>
                    </div>

                    <div className="tags">
                      <ul className="flex gap-1">
                        {comment.tags.map((tag: string, index: number) => {
                          return (
                            <li
                              className="p-1 text-sm text-slate-400"
                              key={index}
                            >
                              #{tag}
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    <CommentLikeBtn
                      postId={comment.id}
                      count={comment.likes_count}
                      authorId={comment.userId}
                      isLiked={
                        comment.likesUser &&
                        comment.likesUser.includes(user.userId)
                      }
                    />
                  </div>
                </div>
                <Divider />
              </>
            </div>
          )
        })
      }
    </div>
  )
}

export default Activity

import {
  CommentState,
  ReviewState,
  UserCommentState,
  UserReviewState,
  RevisedMoviesReviewState,
  RevisedMoviesCommentState,
  MovieFromFirestoreState,
} from './type'
import firestore from './firestore'

export const filterPublicComments = (
  comments: CommentState[] | ReviewState[],
  id: number
) => {
  const publicComments: CommentState[] | ReviewState[] = []
  comments.forEach((comment) => {
    if (comment.movie_id === id && comment.isPublic === true) {
      publicComments.push(comment as any)
    }
  })
  return publicComments
}

export const isUserCommented = (comments: CommentState[], id: string) => {
  return comments.some((comment) => comment.userId === id)
}

export const isMovieCommented = (comments: CommentState[], movieId: number) => {
  return comments.some((comment) => comment.movie_id === movieId)
}

export const countRating = (
  moviesComments: CommentState[] | ReviewState[],
  moviesReviews: CommentState[] | ReviewState[],
  userComment: UserCommentState | UserReviewState
) => {
  const sumForComments = moviesComments.reduce(
    (acc, comment) => acc + comment.rating,
    0
  )
  const sumForReviews = moviesReviews.reduce(
    (acc, review) => acc + review.rating,
    0
  )
  const rating =
    (sumForComments + sumForReviews + userComment.rating) /
    (moviesComments.length + moviesReviews.length + 1)
  return rating
}

export const updateMovieRatings = async (
  originalPost: ReviewState | CommentState,
  moviesData: MovieFromFirestoreState,
  revisedPost: RevisedMoviesReviewState | RevisedMoviesCommentState
) => {
  if (!originalPost) return
  if (!moviesData) return
  try {
    const updatedRating = {
      rating:
        (moviesData.rating * moviesData.ratings_count -
          originalPost.rating +
          revisedPost.rating) /
        moviesData.ratings_count,
    }
    await firestore.setDoc(
      'MOVIES',
      String(originalPost.movie_id),
      updatedRating
    )
  } catch (error) {
    console.error('Error updating movie ratings: ', error)
  }
}

export const updateDeleteMovieRatings = async (
  post: CommentState | ReviewState,
  moviesData: MovieFromFirestoreState
) => {
  if (!post) return
  if (!moviesData) return
  const updatedRating = {
    rating:
      moviesData.ratings_count - 1 === 0
        ? 0
        : (moviesData.rating * moviesData.ratings_count - post.rating) /
          (moviesData.ratings_count - 1),
    ratings_count: moviesData.ratings_count - 1,
  }
  try {
    await firestore.setDoc('MOVIES', String(post.movie_id), updatedRating)
  } catch (error) {
    console.error('Error updating movie ratings: ', error)
  }
}

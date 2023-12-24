import { CommentState, ReviewState } from './type'

export const renderComments = (
  comments: CommentState[] | ReviewState[],
  id: number
) => {
  const publicComments: CommentState[] = []
  comments.forEach((comment) => {
    if (comment.movie_id === id && comment.isPublic === true) {
      publicComments.push(comment as CommentState)
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

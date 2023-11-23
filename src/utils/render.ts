interface MoviesCommentsForIdState {
  userId: string
  author: string
  avatar: string
  comment: string
  comments_count: number
  created_at: Date
  isPublic: boolean
  likes_count: number
  movie_id: number
  rating: number
  tags: string[]
  updated_at: Date
}

export const renderComments = (
  comments: MoviesCommentsForIdState[],
  id: number
) => {
  const publicComments: any = []
  comments.forEach((comment) => {
    if (comment.movie_id === id && comment.isPublic === true) {
      publicComments.push(comment)
    }
  })
  return publicComments
}

export const isUserCommented = (
  comments: MoviesCommentsForIdState[],
  id: string
) => {
  return comments.some((comment) => comment.userId === id)
}

export const isMovieCommented = (
  comments: MoviesCommentsForIdState[],
  movieId: number
) => {
  return comments.some((comment) => comment.movie_id === movieId)
}

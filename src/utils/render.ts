export const renderComments = (comments:any, id:number) => {
  const publicComments:any = []
  comments.forEach(comment => {
    if (comment.movie_id === id && comment.isPublic === true) {
      publicComments.push(comment)
    }
  })
  return publicComments
}

export const isUserCommented = (comments:any, id:string) => {
  return comments.some(comment => comment.userId === id)
}

export const isMovieCommented = (comments:any, movieId: number) => {
  return comments.some(comment => comment.movie_id === movieId)
}
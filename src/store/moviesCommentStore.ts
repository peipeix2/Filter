import { create } from 'zustand'

const useMoviesCommentStore = create((set) => ({
  moviesComment: {
    comment: '',
    comments_count: 0,
    isPublic: true,
    likes_count: 0,
    rating: 0,
    tags: ''
  },
  setMoviesComment: (fieldName:any, value:any) => {
    set((state:any) => ({ moviesComment:{...state.moviesComment, [fieldName]: value } }))
  }
}))

export default useMoviesCommentStore
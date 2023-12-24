import { create } from 'zustand'
import { CommentState, ReviewState, UserCommentState } from '../utils/type'

interface RevisedMoviesCommentState {
  comment: string
  rating: number
  isPublic: boolean
}

interface MoviesCommentsStoreState {
  moviesComment: UserCommentState
  setMoviesComment: (
    fieldName: string,
    value: string | number | File | boolean
  ) => void
  resetMoviesComment: () => void
  moviesCommentsForId: CommentState[] | ReviewState[]
  setMoviesCommentsForId: (
    moviesCommentsForId: CommentState[] | ReviewState[]
  ) => void
  revisedMoviesComment: RevisedMoviesCommentState
  setRevisedMoviesComment: (
    fieldName: string,
    value: string | number | File | boolean
  ) => void
}

const useMoviesCommentStore = create<MoviesCommentsStoreState>((set) => ({
  moviesComment: {
    comment: '',
    comments_count: 0,
    isPublic: true,
    likes_count: 0,
    rating: 0,
  },
  setMoviesComment: (fieldName, value) => {
    set((state) => ({
      moviesComment: { ...state.moviesComment, [fieldName]: value },
    }))
  },
  resetMoviesComment: () => {
    set(() => ({
      moviesComment: {
        comment: '',
        comments_count: 0,
        isPublic: true,
        likes_count: 0,
        rating: 0,
      },
    }))
  },
  moviesCommentsForId: [],
  setMoviesCommentsForId: (moviesCommentsForId) =>
    set(() => ({ moviesCommentsForId: moviesCommentsForId })),
  revisedMoviesComment: {
    comment: '',
    isPublic: true,
    rating: 0,
  },
  setRevisedMoviesComment: (
    fieldName: string,
    value: string | boolean | File | number
  ) => {
    set((state) => ({
      revisedMoviesComment: {
        ...state.revisedMoviesComment,
        [fieldName]: value,
      },
    }))
  },
}))

export default useMoviesCommentStore

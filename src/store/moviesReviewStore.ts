import { create } from 'zustand'
import {
  CommentState,
  ReviewState,
  UserReviewState,
  RevisedMoviesReviewState,
} from '../utils/type'

interface MoviesReviewsStoreState {
  moviesReview: UserReviewState
  setMoviesReview: (
    fieldName: string,
    value: string | boolean | number | File
  ) => void
  resetMoviesReview: () => void
  moviesReviewsForId: CommentState[] | ReviewState[]
  setMoviesReviewsForId: (
    moviesCommentsForId: ReviewState[] | CommentState[]
  ) => void
  revisedMoviesReview: RevisedMoviesReviewState
  setRevisedMoviesReview: (
    fieldName: string,
    value: string | boolean | number | File
  ) => void
}

const useMoviesReviewStore = create<MoviesReviewsStoreState>((set) => ({
  moviesReview: {
    title: '',
    review: '',
    comments_count: 0,
    isPublic: true,
    likes_count: 0,
    rating: 0,
  },
  setMoviesReview: (fieldName, value) => {
    set((state) => ({
      moviesReview: { ...state.moviesReview, [fieldName]: value },
    }))
  },
  resetMoviesReview: () => {
    set(() => ({
      moviesReview: {
        title: '',
        review: '',
        comments_count: 0,
        isPublic: true,
        likes_count: 0,
        rating: 0,
      },
    }))
  },
  moviesReviewsForId: [],
  setMoviesReviewsForId: (moviesReviewsForId) =>
    set(() => ({ moviesReviewsForId: moviesReviewsForId })),
  revisedMoviesReview: {
    title: '',
    review: '',
    isPublic: true,
    rating: 0,
  },
  setRevisedMoviesReview: (
    fieldName: string,
    value: string | boolean | number | File
  ) => {
    set((state) => ({
      revisedMoviesReview: {
        ...state.revisedMoviesReview,
        [fieldName]: value,
      },
    }))
  },
}))

export default useMoviesReviewStore

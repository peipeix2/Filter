import { Timestamp } from 'firebase/firestore'
import { create } from 'zustand'
import { ReviewState } from '../utils/type'

interface MoviesReviewState {
  title: string
  review: string
  comments_count: number
  isPublic: boolean
  likes_count: number
  rating: number
}

interface RevisedMoviesReviewState {
  title: string
  review: string
  rating: number
  isPublic: boolean
}

interface MoviesReviewsForIdState {
  id: string
  title: string
  author: string
  userId: string
  avatar: string
  review: string
  comments_count: number
  created_at: Timestamp
  isPublic: boolean
  likes_count: number
  movie_id: number
  rating: number
  tags: string[]
  updated_at: Timestamp
  movie_title: string
  movie_original_title: string
  movie_backdrop_path: string
  movie_poster: string
  movie_release: string
  likesUser: string[]
}

interface MoviesReviewsStoreState {
  moviesReview: MoviesReviewState
  setMoviesReview: (
    fieldName: string,
    value: string | boolean | number | File
  ) => void
  resetMoviesReview: () => void
  moviesReviewsForId: ReviewState[]
  setMoviesReviewsForId: (moviesCommentsForId: ReviewState[]) => void
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

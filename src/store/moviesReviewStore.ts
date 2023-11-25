import { create } from 'zustand'

interface MoviesReviewState {
    title: string
    review: string
    comments_count: number
    isPublic: boolean
    likes_count: number
    rating: number
}

interface MoviesReviewsForIdState {
  id: string
  title: string
  author: string
  userId: string
  avatar: string
  review: string
  comments_count: number
  created_at: Date
  isPublic: boolean
  likes_count: number
  movie_id: number
  rating: number
  tags: string[]
  updated_at: Date
  movie_title: string
  movie_original_title: string
  movie_backdrop_path: string
  movie_poster: string
  movie_release: string
}

interface MoviesReviewsStoreState {
    moviesReview: MoviesReviewState
    setMoviesReview: (fieldName: string, value: any) => void
    resetMoviesReview: () => void
    moviesReviewsForId: MoviesReviewsForIdState[]
    setMoviesReviewsForId: (
        moviesCommentsForId: MoviesReviewsForIdState
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
    setMoviesReviewsForId: (moviesReviewsForId: any) =>
        set(() => ({ moviesReviewsForId: moviesReviewsForId })),
}))

export default useMoviesReviewStore

import { Timestamp } from 'firebase/firestore'
import { create } from 'zustand'
import { CommentState } from '../utils/type'

interface MoviesCommentState {
  comment: string
  comments_count: number
  isPublic: boolean
  likes_count: number
  rating: number
}

interface RevisedMoviesCommentState {
  comment: string
  rating: number
  isPublic: boolean
}

interface MoviesCommentsForIdState {
  id: string
  author: string
  userId: string
  avatar: string
  comment: string
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

interface MoviesCommentsStoreState {
  moviesComment: MoviesCommentState
  setMoviesComment: (
    fieldName: string,
    value: string | number | File | boolean
  ) => void
  resetMoviesComment: () => void
  moviesCommentsForId: CommentState[]
  setMoviesCommentsForId: (moviesCommentsForId: CommentState[]) => void
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

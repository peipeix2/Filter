import { create } from 'zustand'

interface MoviesCommentState {
  comment: string
  comments_count: number
  isPublic: boolean
  likes_count: number
  rating: number
}

interface RevisedMoviesCommentState {
    comment: string,
    rating: number,
    isPublic: boolean
}

interface MoviesCommentsForIdState {
  id: string
  author: string
  userId: string
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
  movie_title: string
  movie_original_title: string
  movie_backdrop_path: string
  movie_poster: string
  movie_release: string
}

interface MoviesCommentsStoreState {
  moviesComment: MoviesCommentState
  setMoviesComment: (fieldName: string, value: any) => void
  resetMoviesComment: () => void
  moviesCommentsForId: MoviesCommentsForIdState[]
  setMoviesCommentsForId: (
    moviesCommentsForId: MoviesCommentsForIdState
  ) => void
  revisedMoviesComment: RevisedMoviesCommentState
  setRevisedMoviesComment: (fieldName: string, value: any) => void
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
  setMoviesCommentsForId: (moviesCommentsForId: any) =>
    set(() => ({ moviesCommentsForId: moviesCommentsForId })),
  revisedMoviesComment: {
    comment: '',
    isPublic: true,
    rating: 0,
  },
  setRevisedMoviesComment: (fieldName:any, value:any) => {
    set((state) => ({
      revisedMoviesComment: {
        ...state.revisedMoviesComment,
        [fieldName]: value,
      }
    }))
  }
}))

export default useMoviesCommentStore

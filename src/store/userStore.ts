import { create } from 'zustand'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
const auth = getAuth()

interface userState {
  userId: string
  username: string | undefined | null
  email: string | undefined | null
  avatar: string
}

interface userMoviesCommentsState {
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

interface userMoviesReviewsState {
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

interface userStoreState {
  user: userState
  setUser: (value: userState) => void
  resetUser: () => void
  isLogin: boolean
  setIsLogin: (value: boolean) => void
  checkIfLogin: () => void
  getUserProfile: () => void
  hasCommented: boolean
  setHasCommented: (value: boolean) => void
  userMoviesComments: userMoviesCommentsState[]
  setUserMoviesComments: (userMoviesComments: userMoviesCommentsState) => void
  userMoviesReviews: userMoviesReviewsState[]
  setUserMoviesReviews: (userMoviesReviews: userMoviesReviewsState) => void
  userFollowings: userState[] | null
  setUserFollowings: (userFollowings: userState) => void
  userFollowers: userState[] | null
  setUserFollowers: (userFollowers: userState) => void
}

const useUserStore = create<userStoreState>((set) => ({
  user: {
    userId: '',
    username: '',
    email: '',
    avatar: '',
  },
  setUser: (value: any) => set({ user: value }),
  resetUser: () =>
    set({
      user: {
        userId: '',
        username: '',
        email: '',
        avatar: '',
      },
    }),
  isLogin: false,
  setIsLogin: (value: boolean) => set({ isLogin: value }),
  checkIfLogin: () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        set({ isLogin: true })
      } else {
        set({ isLogin: false })
      }
    })
  },
  getUserProfile: () => {
    const user = auth.currentUser
    if (!user || !user?.photoURL) return
    set({
      user: {
        userId: user.uid,
        username: user?.displayName,
        email: user?.email,
        avatar: user.photoURL,
      },
    })
  },
  hasCommented: false,
  setHasCommented: (value: boolean) => set({ hasCommented: value }),
  userMoviesComments: [],
  setUserMoviesComments: (userMoviesComments: any) =>
    set(() => ({ userMoviesComments: userMoviesComments })),
  userMoviesReviews: [],
  setUserMoviesReviews: (userMoviesReviews: any) =>
    set(() => ({ userMoviesReviews: userMoviesReviews })),
  userFollowings: null,
  setUserFollowings: (userFollowings: any) =>
    set(() => ({ userFollowings: userFollowings })),
  userFollowers: null,
  setUserFollowers: (userFollowers: any) =>
    set(() => ({ userFollowers: userFollowers })),
}))

export default useUserStore

import { create } from 'zustand'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
const auth = getAuth()
import { CommentState, ReviewState, FollowUserState } from '../utils/type'

interface userState {
  userId: string
  username: string | undefined | null
  email: string | undefined | null
  avatar: string
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
  userMoviesComments: CommentState[]
  setUserMoviesComments: (userMoviesComments: CommentState[]) => void
  userMoviesReviews: ReviewState[]
  setUserMoviesReviews: (userMoviesReviews: ReviewState[]) => void
  userFollowings: FollowUserState[] | null
  setUserFollowings: (userFollowings: FollowUserState[]) => void
  userFollowers: FollowUserState[] | null
  setUserFollowers: (userFollowers: FollowUserState[]) => void
}

const useUserStore = create<userStoreState>((set) => ({
  user: {
    userId: '',
    username: '',
    email: '',
    avatar: '',
  },
  setUser: (value) => set({ user: value }),
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
  setUserMoviesComments: (userMoviesComments) =>
    set(() => ({ userMoviesComments: userMoviesComments })),
  userMoviesReviews: [],
  setUserMoviesReviews: (userMoviesReviews) =>
    set(() => ({ userMoviesReviews: userMoviesReviews })),

  userFollowings: null,
  setUserFollowings: (userFollowings) =>
    set(() => ({ userFollowings: userFollowings })),
  userFollowers: null,
  setUserFollowers: (userFollowers) =>
    set(() => ({ userFollowers: userFollowers })),
}))

export default useUserStore

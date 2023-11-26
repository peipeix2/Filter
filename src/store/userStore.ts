import { create } from 'zustand'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
const auth = getAuth()

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
  userMoviesComments: any
  setUserMoviesComments: any
  userMoviesReviews: any
  setUserMoviesReviews: any
  userFollowings: any
  setUserFollowings: any
  userFollowers: any
  setUserFollowers: any
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
  userFollowings: [],
  setUserFollowings: (userFollowings: any) =>
    set(() => ({ userFollowings: userFollowings })),
  userFollowers: [],
  setUserFollowers: (userFollowers: any) =>
    set(() => ({ userFollowers: userFollowers })),
}))

export default useUserStore

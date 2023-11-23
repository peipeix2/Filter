import { create } from 'zustand'

const useUserStore = create((set) => ({
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
      }
    }),
}))

export default useUserStore
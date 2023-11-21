import { create } from 'zustand'

const useMovieRatingStore = create((set) => ({
  rating: 0,
  setRating: (value:any) => set({ rating: value })
}))

export default useMovieRatingStore
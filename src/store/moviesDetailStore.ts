import { create } from 'zustand'

const useMoviesDetailStore = create((set) => ({
    moviesDetail: [],
    setMoviesDetail: (moviesDetail:any) => set({ moviesDetail }),
}))

export default useMoviesDetailStore
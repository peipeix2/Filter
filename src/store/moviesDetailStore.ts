import { create } from 'zustand'

const useMoviesDetailStore = create((set) => ({
    moviesDetail: [],
    moviesCast: [],
    moviesCrew: [],
    fetchMoviesDetail: async (URL: string) => {
        const response = await fetch(URL)
        const data = await response.json()
        set({ moviesDetail: data })
    },
    fetchMoviesCast: async (URL: string) => {
        const response = await fetch(URL)
        const data = await response.json()
        set({ moviesCast: data.cast })
    },
    fetchMoviesCrew: async (URL: string) => {
        const response = await fetch(URL)
        const data = await response.json()
        set({ moviesCrew: data.crew })
    }
}))

export default useMoviesDetailStore

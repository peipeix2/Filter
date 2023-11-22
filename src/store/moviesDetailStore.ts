import { create } from 'zustand'

interface GenreState {
    id: number
    name: string
}

interface ProductionCompany {
    id: number
    logo_path: string
    name: string
    origin_country: string
}

interface ProductionCountries {
    iso_3116_1: string
    name: string
}

interface SpokenLanguages {
    english_name: string
    iso_639_1: string
    name: string
}

interface MoviesDetailsState {
    backdrop_path: string
    budget: number
    genres: GenreState[]
    id: number
    original_language: string
    original_title: string
    overview: string
    poster_path: string
    production_companies: ProductionCompany[]
    production_countries: ProductionCountries[]
    release_date: string
    revenue: number
    runtime: number
    spoken_languages: SpokenLanguages[]
    title: string
    [key: string]: any
}

interface CastState {
    id: number
    name: string
    profile_path: string
    order: number
    character: string
    [key: string]: any
}

interface CrewState {
    id: number
    name: string
    profile_path: string
    job: string
    [key: string]: any
}

interface MoviesDetailStoreState {
    moviesDetail: MoviesDetailsState
    moviesCast: CastState[]
    moviesCrew: CrewState[]
    fetchMoviesDetail: (URL:string) => Promise<void>
    fetchMoviesCast: (URL:string) => Promise<void>
    fetchMoviesCrew: (URL:string) => Promise<void>
}

const useMoviesDetailStore = create<MoviesDetailStoreState>((set) => ({
    moviesDetail: {
    backdrop_path: '',
    budget: 0,
    genres: [],
    id: 0,
    original_language: '',
    original_title: '',
    overview: '',
    poster_path: '',
    production_companies: [],
    production_countries: [],
    release_date: '',
    revenue: 0,
    runtime: 0,
    spoken_languages: [],
    title: '',
},
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
        set({ moviesCast: data.cast.slice(0, 5) })
    },
    fetchMoviesCrew: async (URL: string) => {
        const response = await fetch(URL)
        const data = await response.json()
        set({ moviesCrew: data.crew })
    },
}))

export default useMoviesDetailStore

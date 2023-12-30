import { useState, useEffect, useRef } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../firebase.ts'
import api from '../../utils/api.tsx'
import HeroImg from '../../components/HeroImg/index.tsx'
import PopularComments from './PopularComments.tsx'
import MidHero from '../../components/HeroImg/MidHero.tsx'
import useUserStore from '../../store/userStore.ts'
import Carousel from '../../components/Carousel/index.tsx'
import { MovieFromFirestoreState, UserProfileState } from '../../utils/type.ts'
import firestore from '../../utils/firestore.tsx'
import { MovieFromAPIState } from '../../utils/type.ts'
import MoviesShowcase from './MoviesShowcase.tsx'
import CategoryTitle from './CategoryTitle.tsx'

const Home = () => {
  const [moviesRating, setMoviesRating] = useState<MovieFromFirestoreState[]>(
    []
  )
  const [popularMovies, setPopularMovies] = useState<MovieFromAPIState[]>([])
  const [nowPlaying, setNowPlaying] = useState<MovieFromAPIState[]>([])
  const [userProfile, setUserProfile] = useState<UserProfileState | null>(null)
  const featureIntroRef = useRef<HTMLDivElement>(null)
  const { isLogin, user } = useUserStore()

  useEffect(() => {
    async function getMoviesDataFromAPI(category: string) {
      const result = await api.getMovies(category)
      const data = result.results.slice(0, 5)
      firestore.createMoviesDoc(data)
      return data
    }

    function updatePopularAndPlayingMoviesState(
      popularMovies: MovieFromAPIState[],
      nowPlayingMovies: MovieFromAPIState[]
    ) {
      setPopularMovies(popularMovies)
      setNowPlaying(nowPlayingMovies)
    }

    Promise.all([
      getMoviesDataFromAPI('popular'),
      getMoviesDataFromAPI('now_playing'),
    ]).then(([popularMovies, nowPlayingMovies]) => {
      updatePopularAndPlayingMoviesState(popularMovies, nowPlayingMovies)
      getMoviesRating(popularMovies, nowPlayingMovies)
    })
  }, [])

  useEffect(() => {
    if (user.userId) {
      getUserProfile(user.userId)
    }
  }, [])

  const getMoviesRating = async (
    popularMovies: MovieFromAPIState[],
    nowPlayingMovies: MovieFromAPIState[]
  ) => {
    const allMovies = [...popularMovies, ...nowPlayingMovies]
    const moviesData: MovieFromFirestoreState[] = []
    const moviesIds: Number[] = []
    for (const movie of allMovies) {
      if (!moviesIds.includes(movie.id)) {
        const docSnap = await getDoc(doc(db, 'MOVIES', String(movie.id)))
        if (docSnap.exists()) {
          moviesData.push(docSnap.data() as MovieFromFirestoreState)
        }
        moviesIds.push(movie.id)
      }
    }
    setMoviesRating(moviesData)
  }

  const getUserProfile = async (userId: string) => {
    const docSnap = await getDoc(doc(db, 'USERS', userId))
    if (docSnap.exists()) {
      setUserProfile(docSnap.data() as UserProfileState)
    }
  }

  const scrollToFeaturesIntro = () => {
    if (featureIntroRef.current) {
      window.scrollTo({
        top: featureIntroRef.current.offsetTop,
        behavior: 'smooth',
      })
    }
  }

  const FrontPageShowcaseMovies = [
    {
      category: '熱門電影',
      categoryEn: 'popular',
      moviesDetails: popularMovies,
    },
    {
      category: '上映電影',
      categoryEn: 'now_playing',
      moviesDetails: nowPlaying,
    },
  ]

  return (
    <div className="homepage-container">
      {isLogin ? (
        <Carousel />
      ) : (
        <HeroImg
          backdrop="/vAsxVpXP53cMSsD9u4EekQKz4ur.jpg"
          handleOnClick={scrollToFeaturesIntro}
        />
      )}

      <div className="movie-lists-container mx-auto my-40 w-3/5">
        <CategoryTitle category="最新熱映" slogan="Popular, Now in Cinema" />

        {FrontPageShowcaseMovies.map((item) => {
          return (
            <MoviesShowcase
              category={item.category}
              categoryEn={item.categoryEn}
              moviesDetails={item.moviesDetails}
              moviesRating={moviesRating}
            />
          )
        })}
      </div>

      <div ref={featureIntroRef}>
        <MidHero
          backdrop={
            isLogin && userProfile
              ? userProfile.backdrop
              : 'https://image.tmdb.org/t/p/original/bWIIWhnaoWx3FTVXv6GkYDv3djL.jpg'
          }
        />
      </div>

      <div className="mx-auto mt-40 w-3/5">
        <CategoryTitle category="全站熱門" slogan="Latest on Filter" />
        <PopularComments />
      </div>
    </div>
  )
}

export default Home

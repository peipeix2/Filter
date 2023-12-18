import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  setDoc,
  where,
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from '../../../firebase.ts'
import { Image, Divider } from '@nextui-org/react'
import api from '../../utils/api.tsx'
import HeroImg from '../../components/HeroImg/index.tsx'
import { FaStar } from 'react-icons/fa'
import { IoEyeSharp } from 'react-icons/io5'
import PopularComments from './PopularComments.tsx'
import MidHero from '../../components/HeroImg/MidHero.tsx'
import useUserStore from '../../store/userStore.ts'
import Carousel from '../../components/Carousel/index.tsx'

interface Movie {
  id: number
  title: string
  original_title: string
  poster_path: string
}

interface MovieRating {
  id: number
  rating: number
  ratings_count: number
}

const Home = () => {
  const [moviesRating, setMoviesRating] = useState<Array<MovieRating>>([])
  const [moviesFromAPI, setMoviesFromAPI] = useState<Array<Movie>>([])
  const [nowPlaying, setNowPlaying] = useState<Array<Movie>>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const featureIntroRef = useRef<HTMLDivElement>(null)
  const { isLogin, user } = useUserStore()

  useEffect(() => {
    async function getPopularMovie() {
      const result = await api.getMovies('popular')
      const data = result.results.slice(0, 5)
      createMoviesDoc(data)
      setMoviesFromAPI(data)
      return data
    }

    async function getNowPlayingMovie() {
      const result = await api.getMovies('now_playing')
      const data = result.results.slice(0, 5)
      createMoviesDoc(data)
      setNowPlaying(data)
      return data
    }

    Promise.all([getPopularMovie(), getNowPlayingMovie()]).then(
      ([popularMovies, nowPlayingMovies]) => {
        getMoviesRating(popularMovies, nowPlayingMovies)
      }
    )
  }, [])

  useEffect(() => {
    if (user.userId) {
      getUserProfile(user.userId)
    }
  }, [])

  const getMoviesRating = async (popularMovies: any, nowPlayingMovies: any) => {
    const allMovies = [...popularMovies, ...nowPlayingMovies]
    const moviesData: any = []
    const moviesIds: Number[] = []
    for (const movie of allMovies) {
      if (!moviesIds.includes(movie.id)) {
        const docSnap = await getDoc(doc(db, 'MOVIES', String(movie.id)))
        if (docSnap.exists()) {
          moviesData.push(docSnap.data())
        }
        moviesIds.push(movie.id)
      }
    }
    setMoviesRating(moviesData)
  }

  const checkIfSavedToFirestore = async (id: unknown) => {
    const moviesRef = collection(db, 'MOVIES')
    const q = query(moviesRef, where('id', '==', id))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.docs.length === 0) return false
    return true
  }

  const createMoviesDoc = async (data: any) => {
    for (const item of data) {
      const isSavedToFirestore = await checkIfSavedToFirestore(item.id)
      if (isSavedToFirestore) {
        console.log('movie already in database.')
      } else {
        console.log('movie not exists in database yet.')
        await setDoc(doc(db, 'MOVIES', `${item.id}`), {
          id: item.id,
          title: item.title,
          original_title: item.original_title,
          overview: item.overview,
          poster_path: item.poster_path,
          release_date: item.release_date,
          rating: 0,
          ratings_count: 0,
          comments_count: 0,
          reviews_count: 0,
          wishes_count: 0,
          tag: [],
        })
      }
    }
  }

  const handleOnClick = () => {
    if (featureIntroRef.current) {
      window.scrollTo({
        top: featureIntroRef.current.offsetTop,
        behavior: 'smooth',
      })
    }
  }

  const getUserProfile = async (userId: string) => {
    const docSnap = await getDoc(doc(db, 'USERS', userId))
    if (docSnap.exists()) {
      setUserProfile(docSnap.data())
    }
  }

  return (
    <>
      {isLogin ? (
        <Carousel />
      ) : (
        <HeroImg
          backdrop="/vAsxVpXP53cMSsD9u4EekQKz4ur.jpg"
          handleOnClick={handleOnClick}
        />
      )}

      <div className="movie-lists-container mx-auto my-40 w-3/5">
        <div className="mx-auto mb-2 text-right font-extrabold">
          <p className="text-sm">最新熱映</p>
          <p className="text-2xl">/ Popular, Now in Cinema</p>
        </div>

        <div className="popular-container mt-20">
          <div className="title-wrapper flex items-center justify-between">
            <p className="text-base font-semibold text-[#475565]">熱門電影</p>
            <Link to={`browse/popular`} className="text-sm text-[#475565]">
              More
            </Link>
          </div>
          <Divider className="mt-1" />

          <div className="my-5 flex gap-2">
            {moviesFromAPI.map((movie, index) => {
              return (
                <Link
                  to={`/movies/${movie.id}`}
                  key={index}
                  className="w-23% group relative block h-full"
                >
                  <Image
                    radius="sm"
                    className="min-h-full min-w-full object-cover"
                    alt="film-poster"
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    style={{ aspectRatio: '2/3' }}
                  />
                  <div className="absolute inset-0 z-10 h-full w-full overflow-hidden bg-fixed opacity-90 duration-300 hover:bg-white">
                    <div className="flex h-full flex-col items-center justify-center text-[#475565] opacity-0 group-hover:opacity-100">
                      <p className="text-center text-xs font-semibold">
                        {movie.title}
                      </p>
                      <small className="text-center text-xs">
                        {movie.original_title}
                      </small>
                      {moviesRating.map((item) => {
                        if (item.id === movie.id) {
                          return (
                            <div className="mt-2">
                              <div className="flex items-center gap-4 text-[36px]">
                                <FaStar color="#95aeac" />
                                <span>{item.rating.toFixed(0)}</span>
                              </div>
                              <div className="flex items-center gap-4 text-[36px]">
                                <IoEyeSharp color="#95aeac" />
                                <span>{item.ratings_count}</span>
                              </div>
                            </div>
                          )
                        }
                      })}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="now-playing-container mt-20">
          <div className="title-wrapper flex items-center justify-between">
            <p className="text-base font-semibold text-[#475565]">上映電影</p>
            <Link to={`browse/now_playing`} className="text-sm text-[#475565]">
              More
            </Link>
          </div>
          <Divider className="mt-1" />

          <div className="my-5 flex gap-2">
            {nowPlaying.map((movie, index) => {
              return (
                <Link
                  to={`/browse/${movie.id}`}
                  key={index}
                  className="w-23% group relative block h-full"
                >
                  <Image
                    radius="sm"
                    className="min-h-full min-w-full object-cover"
                    alt="film-poster"
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    style={{ aspectRatio: '2/3' }}
                  />
                  <div className="absolute inset-0 z-10 h-full w-full overflow-hidden bg-fixed opacity-90 duration-300 hover:bg-white">
                    <div className="flex h-full flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                      <p className="text-center text-xs font-semibold">
                        {movie.title}
                      </p>
                      <small className="text-center text-xs">
                        {movie.original_title}
                      </small>
                      {moviesRating.map((item) => {
                        if (item.id === movie.id) {
                          return (
                            <div className="mt-2">
                              <div className="flex items-center gap-4 text-[36px]">
                                <FaStar color="#95aeac" />
                                <span>{item.rating.toFixed(0)}</span>
                              </div>
                              <div className="flex items-center gap-4 text-[36px]">
                                <IoEyeSharp color="#95aeac" />
                                <span>{item.ratings_count}</span>
                              </div>
                            </div>
                          )
                        }
                      })}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
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

      <div className="mx-auto w-3/5">
        <div className="mx-auto mb-2 mt-40 text-right font-extrabold">
          <p className="text-sm">全站熱門</p>
          <p className="text-2xl">/ Latest on Filter</p>
        </div>
        <PopularComments />
      </div>
    </>
  )
}

export default Home

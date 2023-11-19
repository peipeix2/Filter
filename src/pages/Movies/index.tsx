import { useEffect } from 'react'
import { Image, Tabs, Tab } from '@nextui-org/react'
import { Link, Outlet, useParams } from 'react-router-dom'
import useMoviesDetailStore from '../../store/moviesDetailStore'
import RatingPanel from './RatingPanel'

const tabLinks = ['CAST', 'CREW', 'DETAILS', 'RELEASES']

const Movies = () => {
  const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)
  const fetchMoviesDetail = useMoviesDetailStore((state) => state.fetchMoviesDetail)
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const URL =
          `https://api.themoviedb.org/3/movie/${id}?language=zh-TW&api_key=937809fa4831d8654e52f894f9f8da84`
      await fetchMoviesDetail(URL)
    }

    fetchData()
  }, [])

  const isLoading = moviesDetail.length === 0
  if (isLoading) return null

    return (
        <>
            <div
                style={{
                    backgroundImage: `url('https://image.tmdb.org/t/p/original${moviesDetail.backdrop_path}')`,
                }}
                className="w-100% h-[500px] bg-cover bg-center bg-no-repeat"
            />
            <section className="film-introduction mx-auto mt-10 flex w-4/5">
                <div className="film-poster w-1/4">
                    <Image
                        src={`https://image.tmdb.org/t/p/w500${moviesDetail.poster_path}`}
                        alt={moviesDetail.original_title}
                        isBlurred
                    />
                </div>
                <div className="film-detail w-1/2 flex-grow px-[60px]">
                    <div className="title-container flex flex-col gap-2">
                        <h1 className="mr-2 text-4xl font-bold">
                            {moviesDetail.title}
                        </h1>
                        <p className="font-['DM_Serif_Display'] text-2xl">
                            {moviesDetail.original_title}
                        </p>
                    </div>

                    <div className="intro-data-wrapper mt-20 flex">
                        <div className="intro w-3/5">
                            <div className="story">
                                <p className="text-base leading-8 text-[#2a3037]">
                                    {moviesDetail.overview}
                                </p>
                            </div>
                            <div className="genres mt-10 flex gap-2">
                                {moviesDetail.genres.map((genre:any, index:number) => {
                                    return (
                                        <div
                                            className="bg-[#b4c0cd]"
                                            key={index}
                                        >
                                            <span className="text-sm text-[#2a3037]">
                                                {genre.name}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="run-time">
                                <p className="text-sm text-[#2a3037]">
                                    {moviesDetail.runtime} mins
                                </p>
                            </div>

                            <div className="film-details-tab-nav mt-[60px]">
                                {tabLinks.map((tab, index) => {
                                    return (
                                        <Link
                                            to={`./${tab.toLowerCase()}`}
                                            key={index}
                                            className="mr-2 font-['DM_Serif_Display'] text-sm tracking-wide"
                                        >
                                            {tab}
                                        </Link>
                                    )
                                })}
                            </div>
                            <Outlet />
                        </div>
                        <div className="rating-data-wrapper w-2/5">
                            <RatingPanel />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Movies

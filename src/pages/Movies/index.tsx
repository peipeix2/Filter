import { useEffect } from 'react'
import { Image } from '@nextui-org/react'
import { Link, Outlet, useParams, useLocation } from 'react-router-dom'
import useMoviesDetailStore from '../../store/moviesDetailStore'
import RatingPanel from './RatingPanel'
import CommentsSection from './CommentsSection'
import ReviewSection from './ReviewsSection'
import TagsSection from './TagsSection'
import { Accordion, AccordionItem } from '@nextui-org/react'

const tabLinks = ['CAST', 'CREW', 'DETAILS']

interface GenreState {
  id: number
  name: string
}

const Movies = () => {
  const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)
  const fetchMoviesDetail = useMoviesDetailStore(
    (state) => state.fetchMoviesDetail
  )
  const { id } = useParams()
  const location = useLocation()

  useEffect(() => {
    const fetchData = async () => {
      const URL = `https://api.themoviedb.org/3/movie/${id}?language=zh-TW&api_key=937809fa4831d8654e52f894f9f8da84`
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
        className="hidden h-[150px] w-full bg-contain bg-fixed bg-no-repeat lg:h-[500px] lg:bg-cover"
      />
      <section className="film-introduction mx-auto mt-10 flex w-4/5 flex-col lg:flex-row">
        <div className="film-poster mx-auto h-auto w-auto max-w-[300px] lg:sticky lg:top-32 lg:h-[500px] lg:w-1/4">
          <Image
            src={`https://image.tmdb.org/t/p/w500${moviesDetail.poster_path}`}
            alt={moviesDetail.original_title}
            isBlurred
          />
        </div>
        <div className="film-detail mt-10 flex-grow lg:mt-0 lg:w-1/2 lg:px-[60px]">
          <div className="title-container flex flex-col gap-1 text-center lg:gap-2 lg:text-left">
            <h1 className="mr-2 text-2xl font-bold lg:text-4xl">
              {moviesDetail.title}
            </h1>
            <p className="font-['DM_Serif_Display'] text-lg lg:text-2xl">
              {moviesDetail.original_title}
            </p>
          </div>

          <div className="lg:hidden">
            <RatingPanel />
          </div>

          <div className="intro-data-wrapper mt-5 flex flex-col lg:mt-20 lg:flex-row">
            <div className="intro lg:w-3/5">
              <div className="story">
                <p className="text-sm leading-8 text-[#2a3037] lg:text-base">
                  {moviesDetail.overview}
                </p>
              </div>
              <div className="genres mt-10 flex gap-1 text-xs text-[#2a3037] lg:text-sm">
                <span className="mr-2 font-bold">類型 /</span>
                {moviesDetail.genres.map((genre: GenreState, index) => {
                  return <span key={index}>{genre.name}</span>
                })}
              </div>
              <div className="run-time mt-1 flex gap-1  text-[#2a3037] ">
                <span className="mr-2 text-xs font-bold lg:text-sm">
                  片長 /
                </span>
                <p className="text-xs text-[#2a3037] lg:text-sm">
                  {moviesDetail.runtime} 分鐘
                </p>
              </div>

              <TagsSection />

              <div className="film-details-tab-nav mt-[60px]">
                {tabLinks.map((tab, index) => {
                  return (
                    <Link
                      to={`./${tab.toLowerCase()}`}
                      key={index}
                      className={`mr-2 font-['DM_Serif_Display'] text-sm tracking-wide ${
                        location.pathname?.includes(tab.toLowerCase())
                          ? 'border-b-2 border-gray-500 text-gray-500'
                          : 'text-gray-500'
                      }  p-2 `}
                    >
                      {tab}
                    </Link>
                  )
                })}
              </div>
              <Outlet />

              <section className="comments-section mx-auto mt-10">
                <CommentsSection />
              </section>

              <section className="comments-section mx-auto mt-20">
                <ReviewSection />
              </section>
            </div>
            <div className="rating-data-wrapper hidden lg:block lg:w-2/5">
              <RatingPanel />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Movies

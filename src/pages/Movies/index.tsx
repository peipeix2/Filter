import { useEffect } from 'react'
import { Image } from '@nextui-org/react'
import { Link, Outlet, useParams, useLocation } from 'react-router-dom'
import useMoviesDetailStore from '../../store/moviesDetailStore'
import RatingPanel from './RatingPanel'
import CommentsSection from './CommentsSection'
import ReviewSection from './ReviewsSection'
import TagsSection from './TagsSection'

const tabLinks = ['CAST', 'CREW', 'DETAILS']

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
        className="w-100% h-[500px] bg-cover bg-fixed bg-center bg-no-repeat"
      />
      <section className="film-introduction mx-auto mt-10 flex w-4/5">
        <div className="film-poster sticky top-32 h-[500px] w-1/4">
          <Image
            src={`https://image.tmdb.org/t/p/w500${moviesDetail.poster_path}`}
            alt={moviesDetail.original_title}
            isBlurred
          />
        </div>
        <div className="film-detail w-1/2 flex-grow px-[60px]">
          <div className="title-container flex flex-col gap-2">
            <h1 className="mr-2 text-4xl font-bold">{moviesDetail.title}</h1>
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
              <div className="genres mt-10 flex gap-1 text-sm text-[#2a3037]">
                <span className="mr-2 font-bold">類型 /</span>
                {moviesDetail.genres.map((genre: any, index: number) => {
                  return <span key={index}>{genre.name}</span>
                })}
              </div>
              <div className="run-time mt-1 flex gap-1 text-sm text-[#2a3037]">
                <span className="mr-2 font-bold">片長 /</span>
                <p className="text-sm text-[#2a3037]">
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
                          ? 'bg-[#485665] text-white'
                          : 'bg-transparent text-[#485665]'
                      }  rounded p-2 `}
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

import { Link } from 'react-router-dom'
import { Divider, Image } from '@nextui-org/react'
import { MovieFromAPIState, MovieFromFirestoreState } from '../../utils/type'
import { FaStar } from 'react-icons/fa'
import { IoEyeSharp } from 'react-icons/io5'
import SubCategoryTitle from './SubCategoryTitle'

interface MoviesShowcaseState {
  category: string
  categoryEn: string
  moviesDetails: MovieFromAPIState[]
  moviesRating: MovieFromFirestoreState[]
}

const MoviesShowcase = ({
  category,
  categoryEn,
  moviesDetails,
  moviesRating,
}: MoviesShowcaseState) => {
  return (
    <div className="popular-container mt-20">
      <div className="title-wrapper flex items-center justify-between">
        <SubCategoryTitle subCategory={category} />
        <Link
          to={`browse/${categoryEn}`}
          className="text-xs text-[#475565] md:text-sm"
        >
          More
        </Link>
      </div>
      <Divider className="mt-1" />

      <div className="my-5 flex w-full flex-wrap gap-2 sm:flex-nowrap">
        {moviesDetails.map((movie, index) => {
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
                <div className="flex h-full flex-col items-center justify-center px-2 text-[#475565] opacity-0 group-hover:opacity-100">
                  <p className="text-center text-xs font-semibold sm:hidden md:inline">
                    {movie.title}
                  </p>
                  <small className="text-center text-xs sm:hidden md:inline">
                    {movie.original_title}
                  </small>
                  {moviesRating.map((item) => {
                    if (item.id === movie.id) {
                      return (
                        <div className="mt-2">
                          <div className="flex items-center gap-4 text-[36px] sm:text-sm">
                            <FaStar color="#95aeac" />
                            <span>{item.rating.toFixed(0)}</span>
                          </div>
                          <div className="flex items-center gap-4 text-[36px] sm:text-sm">
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
  )
}

export default MoviesShowcase

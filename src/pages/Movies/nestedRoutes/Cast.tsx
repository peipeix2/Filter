import { Tooltip } from '@nextui-org/react'
import useMoviesDetailStore from '../../../store/moviesDetailStore'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CastState } from '../../../utils/type'

const Cast = () => {
  const moviesCast = useMoviesDetailStore((state) => state.moviesCast)
  const fetchMoviesCast = useMoviesDetailStore((state) => state.fetchMoviesCast)
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const URL = `https://api.themoviedb.org/3/movie/${id}/credits?language=zh-TW&api_key=937809fa4831d8654e52f894f9f8da84`
      await fetchMoviesCast(URL)
    }

    fetchData()
  }, [])

  return (
    <div className="mt-5 flex min-h-[150px] flex-wrap gap-2 py-5">
      {moviesCast.map((item: CastState) => {
        return (
          <Tooltip content={`飾演${item.character}`} size="sm">
            <span className="h-fit rounded-lg border border-gray-500 p-2 px-3 text-xs text-slate-500">
              {item.name}
            </span>
          </Tooltip>
        )
      })}
    </div>
  )
}

export default Cast

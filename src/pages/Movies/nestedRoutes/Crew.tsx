import { Tooltip } from '@nextui-org/react'
import useMoviesDetailStore from '../../../store/moviesDetailStore'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

interface CrewState {
  id: number
  name: string
  profile_path: string
  job: string
  [key: string]: any
}

const Crew = () => {
  const moviesCrew = useMoviesDetailStore((state) => state.moviesCrew)
  const fetchMoviesCrew = useMoviesDetailStore((state) => state.fetchMoviesCrew)
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const URL = `https://api.themoviedb.org/3/movie/${id}/credits?language=zh-TW&api_key=937809fa4831d8654e52f894f9f8da84`
      await fetchMoviesCrew(URL)
    }

    fetchData()
  }, [])

  return (
    <div className="mt-5 flex min-h-[150px] flex-wrap gap-2 py-5">
      {moviesCrew.map((item: CrewState) => {
        if (
          item.job === 'Director' ||
          item.job === 'Producer' ||
          item.job === 'Writer'
        ) {
          return (
            <Tooltip content={`職稱 ${item.job}`} size="sm">
              <span className="h-fit rounded-lg border border-gray-500 p-2 px-3 text-xs text-slate-500">
                {item.name}
              </span>
            </Tooltip>
          )
        }
      })}
    </div>
  )
}

export default Crew

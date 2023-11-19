import {
    Tooltip,
    Button,
} from '@nextui-org/react'
import useMoviesDetailStore from '../../../store/moviesDetailStore'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Crew = () => {
    const moviesCrew = useMoviesDetailStore((state) => state.moviesCrew)
    const fetchMoviesCrew = useMoviesDetailStore(
        (state) => state.fetchMoviesCrew
    )
    const { id } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            const URL = `https://api.themoviedb.org/3/movie/${id}/credits?language=zh-TW&api_key=937809fa4831d8654e52f894f9f8da84`
            await fetchMoviesCrew(URL)
        }

        fetchData()
    }, [])

    return (
        <div className="mt-5 flex flex-wrap gap-2">
            {moviesCrew.map((item: any) => {
                if (item.job === 'Director' || item.job === 'Producer' || item.job === 'Writer') {
                    return (
                        <Tooltip content={item.job} size="sm">
                            <Button size="sm">{item.name}</Button>
                        </Tooltip>
                    )
                }
            })}
        </div>
    )
}

export default Crew

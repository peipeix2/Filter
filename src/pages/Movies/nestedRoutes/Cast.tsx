import { Tooltip, Button } from '@nextui-org/react'
import useMoviesDetailStore from '../../../store/moviesDetailStore'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Cast = () => {
    const moviesCast = useMoviesDetailStore((state) => state.moviesCast)
    const fetchMoviesCast = useMoviesDetailStore(
        (state) => state.fetchMoviesCast
    )
    const { id } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            const URL = `https://api.themoviedb.org/3/movie/${id}/credits?language=zh-TW&api_key=937809fa4831d8654e52f894f9f8da84`
            await fetchMoviesCast(URL)
        }

        fetchData()
    }, [])

    return (
        <div className="mt-5 flex flex-wrap gap-2">
            {moviesCast.map((item:any) => {
                return (
                    <Tooltip content={item.character} size="sm">
                        <Button size="sm">{item.name}</Button>
                    </Tooltip>
                )
            })}
        </div>
    )
}

export default Cast

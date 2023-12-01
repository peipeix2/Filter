import { useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from 'react-query'
import api from "../../utils/api"
import firestore from "../../utils/firestore"
import { Image, Skeleton, Pagination } from '@nextui-org/react'
import { Link } from "react-router-dom"

const Gallery = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { category } = useParams()

  if (!category) return
  const getMoviesFromCategory = async ({queryKey}) => {
    const data = await api.getMoviesWithCategories(category, queryKey[1])
    firestore.createMoviesDoc(data.results)
    return data.results
  }
  const { data, isLoading } = useQuery(['getMovies', currentPage], getMoviesFromCategory)

  return (
    <>
      <div className="mx-auto mt-20 flex w-3/5 flex-wrap gap-2">
        {isLoading &&
          Array(20)
            .fill(undefined)
            .map((_, index) => (
              <Skeleton className="h-[346px] w-1/5" key={index} />
            ))}
        {data && data.map((movie: any, index: number) => {
          return (
            <Link to={`/movies/${movie.id}`} key={index} className='w-[19%]'>
              <Image
                alt="film-poster"
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                className="w-full"
              />
            </Link>
          )
        })}
      </div>
      <div className='w-full flex justify-center'>
        <Pagination showControls total={10} initialPage={1} page={currentPage} className="mt-20" onChange={(e) => setCurrentPage(e)} />
      </div>
    </>
  )
}

export default Gallery
import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import api from '../../utils/api'
import firestore from '../../utils/firestore'
import { Image, Skeleton, Pagination } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { collectionGroup, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'

const Gallery = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchParams, setSearchPrams] = useSearchParams()
  const { category } = useParams()
  const searchValue = searchParams.get('keyword')

  if (!category) return
  const getMoviesFromCategory = async ({ queryKey }) => {
    if (category === 'search' && searchValue) {
      const data = await api.queryMovies(
        encodeURIComponent(searchValue),
        queryKey[1]
      )
      firestore.createMoviesDoc(data.results)
      return data.results
    }

    if (category === 'tag' && searchValue) {
      return queryMoviesTag(searchValue)
    }

    const data = await api.getMoviesWithCategories(category, queryKey[1])
    firestore.createMoviesDoc(data.results)
    return data.results
  }

  const queryMoviesTag = async (tag: string) => {
    const commentRef = collectionGroup(db, 'COMMENTS')
    const q = query(commentRef, where('tags', 'array-contains', tag))
    const querySnapshot = await getDocs(q)
    const data: any = []
    querySnapshot.forEach((doc) => {
      data.push(doc.data())
    })
    return data
  }

  const { data, isLoading } = useQuery(
    ['getMovies', currentPage],
    getMoviesFromCategory,
    { refetchOnWindowFocus: false }
  )

  return (
    <div className="mx-auto w-3/5">
      {searchValue && (
        <div className="mx-auto mb-2 mt-20 text-right font-extrabold">
          <p className="text-sm">關鍵字</p>
          <p className="text-2xl">{searchValue}</p>
        </div>
      )}

      <div className="mx-auto mt-20 flex flex-wrap justify-evenly gap-2">
        {isLoading &&
          Array(20)
            .fill(undefined)
            .map((_, index) => (
              <Skeleton className="h-[346px] w-1/5" key={index} />
            ))}
        {data &&
          data.map((movie: any, index: number) => {
            return (
              <Link
                to={`/movies/${movie.id || movie.movie_id}`}
                key={index}
                className="w-[19%]"
              >
                <Image
                  alt="film-poster"
                  src={`https://image.tmdb.org/t/p/w500/${
                    movie.poster_path || movie.movie_poster
                  }`}
                  className="w-full"
                />
              </Link>
            )
          })}
      </div>
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          total={data ? Math.ceil(data.length / 20) : 1}
          initialPage={1}
          page={currentPage}
          className="mt-20"
          classNames={{
            wrapper: 'gap-2',
            item: 'text-[#475565] font-thin bg-transparent shadow-none',
            cursor: 'bg-slate-500',
            prev: 'text-[#475565] font-thin bg-transparent shadow-none',
            next: 'text-[#475565] font-thin bg-transparent shadow-none',
          }}
          onChange={(e) => setCurrentPage(e)}
        />
      </div>
    </div>
  )
}

export default Gallery

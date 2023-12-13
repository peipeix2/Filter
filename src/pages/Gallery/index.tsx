import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import api from '../../utils/api'
import firestore from '../../utils/firestore'
import { Image, Skeleton, Pagination } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { collectionGroup, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'

type QueryKey = [string, number, string, string | null | undefined]

const Gallery = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchParams] = useSearchParams()
  const { category } = useParams()
  const searchValue = searchParams.get('keyword')

  if (!category) return
  const getMoviesFromCategory = async ({ queryKey }: any) => {
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
    ['getMovies', currentPage, category, searchValue] as QueryKey,
    getMoviesFromCategory,
    { refetchOnWindowFocus: false }
  )

  if (!data) return

  return (
    <div className="mx-auto min-h-screen w-3/5">
      {searchValue && (
        <div className="mx-auto mb-2 mt-20 text-right font-extrabold">
          <p className="text-sm">關鍵字</p>
          <p className="text-2xl">{searchValue}</p>
        </div>
      )}

      <div className="mx-auto mt-20 flex flex-wrap justify-start gap-2">
        {isLoading &&
          Array(20)
            .fill(undefined)
            .map((_, index) => (
              <Skeleton className="h-[346px] w-1/5" key={index} />
            ))}
        {data.length !== 0 ? (
          data.map((movie: any, index: number) => {
            return (
              <Link
                to={`/movies/${movie.id || movie.movie_id}`}
                key={index}
                className="group relative block w-[19%]"
              >
                <Image
                  alt="film-poster"
                  src={`https://image.tmdb.org/t/p/w500/${
                    movie.poster_path || movie.movie_poster
                  }`}
                  className="w-full"
                />
                <div className="absolute inset-0 z-10 h-full w-full overflow-hidden bg-fixed opacity-90 duration-300 hover:bg-white">
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-[#475565] opacity-0 group-hover:opacity-100">
                    <p className="text-center text-lg font-bold">
                      {movie.title}
                    </p>
                    <small className="text-center text-xs">
                      {movie.original_title}
                    </small>
                  </div>
                </div>
              </Link>
            )
          })
        ) : (
          <h1>查無搜尋結果</h1>
        )}
      </div>
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          total={data ? Math.ceil(data.length / 20) : 5}
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

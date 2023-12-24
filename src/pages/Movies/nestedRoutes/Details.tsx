import useMoviesDetailStore from '../../../store/moviesDetailStore'

interface DetailsFromAPI {
  name: string
  [key: string]: any
}

const Details = () => {
  const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)

  const moviesDetailList = [
    { title: '語言', content: moviesDetail.spoken_languages },
    { title: '出品國家', content: moviesDetail.production_countries },
    {
      title: '製作公司',
      content: moviesDetail.production_companies,
    },
  ]

  return (
    <div className="mt-5 flex min-h-[150px] flex-wrap gap-2 rounded-lg border border-gray-500 px-3 py-5 text-slate-500">
      {moviesDetailList.map((item) => {
        return (
          <div className="flex w-full justify-between text-xs">
            <p className="mb-2">{item.title}</p>
            <div className="text-right">
              {item.content.map((element: DetailsFromAPI) => {
                return <span className="ml-2">{element.name}</span>
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Details

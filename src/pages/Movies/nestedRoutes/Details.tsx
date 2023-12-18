import useMoviesDetailStore from '../../../store/moviesDetailStore'

const Details = () => {
  const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)

  return (
    <div className="mt-5 flex min-h-[150px] flex-wrap gap-2 rounded-lg border border-gray-500 px-3 py-5 text-slate-500">
      <div className="flex w-full justify-between text-xs">
        <p className="mb-2">語言</p>
        <div className="text-right">
          {moviesDetail.spoken_languages.map((language) => {
            return <span className="ml-2">{language.name}</span>
          })}
        </div>
      </div>
      <div className="flex w-full justify-between text-xs">
        <p className="mb-2">出品國家</p>
        <div className="text-right">
          {moviesDetail.production_countries.map((country) => {
            return <span className="ml-2">{country.name}</span>
          })}
        </div>
      </div>
      <div className="flex w-full justify-between text-xs">
        <p>製作公司</p>
        <div className="text-right">
          {moviesDetail.production_companies.map((company) => {
            return <span className="ml-2">{company.name}</span>
          })}
        </div>
      </div>
    </div>
  )
}

export default Details

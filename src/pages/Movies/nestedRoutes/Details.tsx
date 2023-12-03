import useMoviesDetailStore from "../../../store/moviesDetailStore"
import { Divider } from "@nextui-org/react"

const DUMMY_DATA = {
  adult: false,
  backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
  belongs_to_collection: null,
  budget: 100000000,
  genres: [
    {
      id: 18,
      name: '剧情',
    },
    {
      id: 36,
      name: '历史',
    },
  ],
  homepage: '',
  id: 872585,
  imdb_id: 'tt15398776',
  original_language: 'en',
  original_title: 'Oppenheimer',
  overview:
    '克里斯多夫諾蘭自編自導的《奧本海默》是一部用IMAX攝影機拍攝的史詩驚悚片，觀眾將看到一個謎一般的男人是如何陷入一個自相矛盾的困境，他為了拯救這個世界，必須先毀滅它。',
  popularity: 1020.836,
  poster_path: '/aGfEOxRPwp5lEeYfUU0cBpQ0k9K.jpg',
  production_companies: [
    {
      id: 9996,
      logo_path: '/3tvBqYsBhxWeHlu62SIJ1el93O7.png',
      name: 'Syncopy',
      origin_country: 'GB',
    },
    {
      id: 33,
      logo_path: '/8lvHyhjr8oUKOOy2dKXoALWKdp0.png',
      name: 'Universal Pictures',
      origin_country: 'US',
    },
    {
      id: 507,
      logo_path: '/aRmHe6GWxYMRCQljF75rn2B9Gv8.png',
      name: 'Atlas Entertainment',
      origin_country: 'US',
    },
  ],
  production_countries: [
    {
      iso_3166_1: 'GB',
      name: 'United Kingdom',
    },
    {
      iso_3166_1: 'US',
      name: 'United States of America',
    },
  ],
  release_date: '2023-07-19',
  revenue: 950200000,
  runtime: 181,
  spoken_languages: [
    {
      english_name: 'Dutch',
      iso_639_1: 'nl',
      name: 'Nederlands',
    },
    {
      english_name: 'English',
      iso_639_1: 'en',
      name: 'English',
    },
  ],
  status: 'Released',
  tagline: '',
  title: '奧本海默',
  video: false,
  vote_average: 8.157,
  vote_count: 5107,
}

const Details = () => {
    const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)

    return (
      <div className="mt-5 flex min-h-[150px] flex-wrap gap-2 rounded px-2 py-5 bg-slate-50 text-[#475565]">
        <div className="flex w-full justify-between text-sm">
          <p className="mb-2">語言</p>
          <div className="text-right">
            {DUMMY_DATA.spoken_languages.map((language) => {
              return <span className="ml-2">{language.name}</span>
            })}
          </div>
        </div>
        <div className="flex w-full justify-between text-sm">
          <p className="mb-2">出品國家</p>
          <div className="text-right">
            {DUMMY_DATA.production_countries.map((country) => {
              return <span className="ml-2">{country.name}</span>
            })}
          </div>
        </div>
        <div className="flex w-full justify-between text-sm">
          <p className="mb-2">製作公司</p>
          <div className="text-right">
            {DUMMY_DATA.production_companies.map((company) => {
              return <span className="ml-2">{company.name}</span>
            })}
          </div>
        </div>
      </div>
    )
}

export default Details

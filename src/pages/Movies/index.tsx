import { Image, Divider, Tabs, Tab } from '@nextui-org/react'
import { IoEyeOutline } from 'react-icons/io5'
import { MdOutlineFavoriteBorder } from 'react-icons/md'
import SimplisticStar from '../../components/Star/SimplisticStar'
import { Link, Outlet } from 'react-router-dom'

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
    popularity: 2647.236,
    poster_path: '/7wYG2Rowz7TwOosomGBvuqLAfe5.jpg',
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
    revenue: 950659867,
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
    vote_average: 8.223,
    vote_count: 4516,
}

const tabLinks = ['CAST', 'CREW', 'DETAILS', 'RELEASES']

const Movies = () => {
    return (
        <>
            <div
                style={{
                    backgroundImage: `url('https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg')`,
                }}
                className="w-100% h-[500px] bg-cover bg-center bg-no-repeat"
            />
            <section className="film-introduction mx-auto mt-10 flex w-4/5">
                <div className="film-poster w-1/4">
                    <Image
                        src={`https://image.tmdb.org/t/p/w500${DUMMY_DATA.poster_path}`}
                        alt={DUMMY_DATA.original_title}
                        isBlurred
                    />
                </div>
                <div className="film-detail w-1/2 flex-grow px-[60px]">
                    <div className="title-container flex flex-col gap-2">
                        <h1 className="mr-2 text-4xl font-bold">
                            {DUMMY_DATA.title}
                        </h1>
                        <p className="font-['DM_Serif_Display'] text-2xl">
                            {DUMMY_DATA.original_title}
                        </p>
                    </div>

                    <div className="intro-data-wrapper mt-20 flex">
                        <div className="intro w-3/5">
                            <div className="story">
                                <p className="text-base leading-8 text-[#2a3037]">
                                    {DUMMY_DATA.overview}
                                </p>
                            </div>
                            <div className="genres mt-10 flex gap-2">
                                {DUMMY_DATA.genres.map((genre, index) => {
                                    return (
                                        <div
                                            className="bg-[#b4c0cd]"
                                            key={index}
                                        >
                                            <span className="text-sm text-[#2a3037]">
                                                {genre.name}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="run-time">
                                <p className="text-sm text-[#2a3037]">
                                    {DUMMY_DATA.runtime} mins
                                </p>
                            </div>

                            <div className="film-details-tab-nav mt-[60px]">
                                {tabLinks.map((tab, index) => {
                                    return (
                                        <Link
                                            to={`./${tab.toLowerCase()}`}
                                            key={index}
                                            className="mr-2 font-['DM_Serif_Display'] text-sm tracking-wide"
                                        >
                                            {tab}
                                        </Link>
                                    )
                                })}
                            </div>
                            <Outlet />
                        </div>
                        <div className="rating-data-wrapper w-2/5">
                            <div className="rating-data-wrapper mx-auto w-4/5 bg-slate-100 py-3">
                                <div className="watched-status flex justify-around pb-3">
                                    <div className="flex cursor-pointer flex-col items-center">
                                        <IoEyeOutline className="cursor-pointer text-4xl text-[#94a3ab]" />
                                        <span className="cursor-pointer text-[10px] text-[#beccdc] hover:text-[#475565]">
                                            看過
                                        </span>
                                    </div>
                                    <div className="flex cursor-pointer flex-col items-center hover:text-[#475565]">
                                        <MdOutlineFavoriteBorder className="text-4xl text-[#94a3ab]" />
                                        <span className="cursor-pointer text-[10px] text-[#beccdc] hover:text-[#475565]">
                                            收藏
                                        </span>
                                    </div>
                                </div>

                                <Divider />

                                <div className="rating-wrapper flex flex-col items-center justify-center py-3">
                                    <SimplisticStar rating={5} count={1} />
                                    <p className="mt-2 text-[10px] text-[#beccdc]">
                                        評分
                                    </p>
                                </div>

                                <Divider />

                                <div className="py-3">
                                    <p className="text-center text-[14px] text-[#beccdc]">
                                        寫影評
                                    </p>
                                </div>

                                <Divider />

                                <div className="pt-3">
                                    <p className="text-center text-[14px] text-[#beccdc]">
                                        分享
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Movies

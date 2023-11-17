import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase.ts'
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Input,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Image
} from '@nextui-org/react'
import { CiSearch } from 'react-icons/ci'

interface Movie {
    title: string,
    original_title: string,
    posters: string,
}

const Movies = () => {
    const [movies, setMovies] = useState<Array<Movie>>([])

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const querySnapshot = await getDocs(collection(db, 'MOVIE_DETAILS'))
        const moviesData: any = []

        querySnapshot.forEach((doc) => {
            const movieData = doc.data()
            moviesData.push(movieData)
        })

        setMovies(moviesData)
    }

    return (
        <>
            <div className="m-auto flex w-4/5 items-center justify-between bg-slate-400">
                <div>
                    <span>篩選電影</span>
                    <label htmlFor="filter">類型</label>
                    <select name="filter" id="filter">
                        <option value="comedy">喜劇</option>
                        <option value="drama">劇情</option>
                        <option value="action">動作</option>
                        <option value="adventure">冒險</option>
                    </select>

                    <label htmlFor="filter">評分</label>
                    <select name="filter" id="filter">
                        <option value="comedy">5分</option>
                        <option value="drama">4分</option>
                        <option value="action">3分</option>
                        <option value="adventure">2分</option>
                        <option value="adventure">1分</option>
                    </select>
                </div>

                <div className="flex items-center">
                    <Input
                        classNames={{
                            base: 'max-w-full sm:max-w-[10rem] h-10',
                            mainWrapper: 'h-full',
                            input: 'text-small',
                            inputWrapper:
                                'h-full font-normal text-default-500 bg-slate-800 dark:bg-default-500/20',
                        }}
                        placeholder="搜尋電影"
                        size="sm"
                        startContent={<CiSearch size={18} />}
                        type="search"
                    />
                </div>
            </div>

            <div className="mx-auto my-10 w-4/5">
                <h3 className="font-semibold">熱門電影</h3>
                <div className="my-5 flex gap-2">
                    {movies.map((movie) => {
                        return (
                            <Card className="w-23% py-4">
                                <CardBody>
                                    <Image
                                        alt="film-poster"
                                        src={movie.posters}
                                        className="h-100% w-[300px]"
                                    />
                                </CardBody>
                                <CardHeader className="flex-col items-center">
                                    <p className="text-center">{movie.title}</p>
                                    <small className="text-center">
                                        {movie.original_title}
                                    </small>
                                </CardHeader>
                            </Card>
                        )
                    })}
                </div>
            </div>

            <div className="mx-auto my-10 w-4/5">
                <h3 className="font-semibold">正在上映</h3>
                <div className="my-5 flex gap-2">
                    {movies.map((movie) => {
                        return (
                            <Card className="w-23% py-4">
                                <CardBody>
                                    <Image
                                        alt="film-poster"
                                        src={movie.posters}
                                        className="h-100% w-[300px]"
                                    />
                                </CardBody>
                                <CardHeader className="flex-col items-center">
                                    <p className="text-center">{movie.title}</p>
                                    <small className="text-center">
                                        {movie.original_title}
                                    </small>
                                </CardHeader>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default Movies

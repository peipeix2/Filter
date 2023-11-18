import { useState, useEffect } from 'react'
import { collection, getDocs, query, setDoc, where, doc } from 'firebase/firestore'
import { db } from '../../../firebase.ts'
import {
    Navbar,
    NavbarContent,
    Input,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Card,
    CardHeader,
    CardBody,
    Image,
    Button,
} from '@nextui-org/react'
import { CiSearch } from 'react-icons/ci'
import api from '../../utils/api.tsx'

interface Movie {
    id: string
    title: string
    original_title: string
    poster_path: string
}

const Home = () => {
    const [movies, setMovies] = useState<Array<Movie>>([])
    const [moviesFromAPI, setMoviesFromAPI] = useState<Array<Movie>>([])
    const [nowPlaying, setNowPlaying] = useState<Array<Movie>>([])

    useEffect(() => {
        async function getPopularMovie() {
            const result = await api.getMovies('popular')
            const data = result.results.slice(0, 5)
            createMoviesDoc(data)
            setMoviesFromAPI(data)
        }

        async function getNowPlayingMovie() {
            const result = await api.getMovies('now_playing')
            const data = result.results.slice(0, 5)
            createMoviesDoc(data)
            setNowPlaying(data)
        }

        getPopularMovie()
        getNowPlayingMovie()
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

    const checkIfSavedToFirestore = async (id:unknown) => {
        const moviesRef = collection(db, 'MOVIES')
        const q = query(moviesRef, where("id", "==", id))
        const querySnapshot = await getDocs(q)

        if(querySnapshot.docs.length === 0) return false
        return true
    }

    const createMoviesDoc = async (data:any) => {
       for (const item of data) {
            const isSavedToFirestore = await checkIfSavedToFirestore(item.id)
            if (isSavedToFirestore) {
                console.log('movie already in database.')
            } else {
                console.log('movie not exists in database yet.')
                await setDoc(doc(db, 'MOVIES', `${item.id}`), {
                    id: item.id,
                    title: item.title,
                    original_title: item.original_title,
                    overview: item.overview,
                    poster_path: item.poster_path,
                    release_date: item.release_date,
                    rating: 0,
                    ratings_count: 0,
                    comments_count: 0,
                    reviews_count: 0,
                    wishes_count: 0,
                    tag: [],
                })       
            }      
       }
    }

    return (
        <>
            <Navbar
                position="static"
                className="mx-auto my-5 flex w-4/5 items-center justify-around bg-slate-400"
            >
                <NavbarContent>
                    <span>篩選電影</span>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="bordered">類型</Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem>喜劇</DropdownItem>
                            <DropdownItem>劇情</DropdownItem>
                            <DropdownItem>動作</DropdownItem>
                            <DropdownItem>冒險</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="bordered">評分</Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem>5分</DropdownItem>
                            <DropdownItem>4分</DropdownItem>
                            <DropdownItem>3分</DropdownItem>
                            <DropdownItem>2分</DropdownItem>
                            <DropdownItem>1分</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>

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
            </Navbar>

            <div className="mx-auto my-10 w-4/5">
                <h3 className="font-semibold">熱門電影</h3>
                <div className="my-5 flex gap-2">
                    {moviesFromAPI.map((movie) => {
                        return (
                            <Card className="w-23% py-4" key={movie.id}>
                                <CardBody>
                                    <Image
                                        alt="film-poster"
                                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
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
                    {nowPlaying.map((movie) => {
                        return (
                            <Card className="w-23% py-4" key={movie.id}>
                                <CardBody>
                                    <Image
                                        alt="film-poster"
                                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
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

export default Home

import { useState, useEffect } from 'react'
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs'
import { RxDotFilled } from 'react-icons/rx'
import { User, Button, Skeleton } from '@nextui-org/react'
import parser from 'html-react-parser'
import { db } from '../../../firebase'
import {
  collectionGroup,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore'
import { Link } from 'react-router-dom'
import LoadingMode from './LoadingMode'
import { ReviewState } from '../../utils/type'

const Carousel = () => {
  const [followingUsersReviews, setFollowingUsersReviews] = useState<
    ReviewState[]
  >([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  let isLoading

  useEffect(() => {
    fetchPopularReviews()
  }, [])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (!isHovered) {
      intervalId = setInterval(handleCarouselAutoSlide, 8000)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [currentIndex, isHovered])

  const queryPopularReviews = async () => {
    const commentRef = collectionGroup(db, 'REVIEWS')
    const q = query(commentRef, orderBy('likes_count', 'desc'), limit(3))
    const querySnapshot = await getDocs(q)
    const data: ReviewState[] = []
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as ReviewState)
    })
    return data
  }

  const fetchPopularReviews = async () => {
    isLoading = true
    const data = await queryPopularReviews()
    isLoading = false
    setFollowingUsersReviews(data)
  }

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide
      ? followingUsersReviews.length - 1
      : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const nextSlide = () => {
    const isLastSlide = currentIndex === followingUsersReviews.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const handleChangeSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }

  const handleCarouselAutoSlide = () => {
    const isLastSlide = currentIndex === followingUsersReviews.length - 1

    if (isLastSlide) {
      const newIndex = 0
      setCurrentIndex(newIndex)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  if (!followingUsersReviews[currentIndex]) {
    return (
      <Skeleton className="group relative m-auto h-[780px] w-full max-w-[1920px]"></Skeleton>
    )
  }

  return (
    <div
      className="group relative m-auto h-[780px] w-full max-w-[1920px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${followingUsersReviews[currentIndex].movie_backdrop_path})`,
        }}
        className="h-full w-full bg-cover bg-center duration-500"
      ></div>
      {isLoading ? (
        <LoadingMode />
      ) : (
        <>
          <div className="absolute bottom-0 left-0 right-0 top-0 flex h-[780px] w-full flex-col justify-center overflow-hidden bg-black/[.5] bg-fixed">
            <div className="mx-auto w-[1200px] max-w-[1200px]">
              <div className="title-content w-2/5">
                <span className="text-sm font-light text-[#94a3ab]">
                  POPULAR REVIEWS 熱門影評
                </span>
                <p className="text-5xl font-semibold leading-normal text-white">
                  {followingUsersReviews[currentIndex].title}
                </p>
                <p className="mt-10 line-clamp-2 text-sm leading-relaxed text-slate-300">
                  {parser(followingUsersReviews[currentIndex].review as string)}
                </p>
              </div>
              <div className="author-avatar">
                <Link
                  to={`/profile/${followingUsersReviews[currentIndex].userId}/activity`}
                >
                  <User
                    className="mt-5 text-slate-300"
                    name={followingUsersReviews[currentIndex].author}
                    avatarProps={{
                      src: followingUsersReviews[currentIndex].avatar,
                    }}
                    isFocusable={true}
                  />
                </Link>
              </div>
              <Button
                size="md"
                className="mt-5 w-[100px] bg-[#89a9a6] text-white"
              >
                <Link
                  to={`/read/${followingUsersReviews[currentIndex].userId}/${followingUsersReviews[currentIndex].id}`}
                >
                  Read More
                </Link>
              </Button>
            </div>
          </div>
          <Link
            to={`/movies/${followingUsersReviews[currentIndex].movie_id}`}
            className="absolute bottom-20 right-5 flex cursor-pointer gap-2 text-xs text-slate-400 hover:text-white"
          >
            <span>《{followingUsersReviews[currentIndex].movie_title}》</span>
            <span>
              {followingUsersReviews[currentIndex].movie_original_title}
            </span>
          </Link>
        </>
      )}

      <div className="absolute left-5 top-[50%] hidden -translate-x-0 translate-y-[50%] cursor-pointer rounded-full bg-black/20 p-2 text-2xl text-white group-hover:block">
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div>
      <div className="absolute right-5 top-[50%] hidden -translate-x-0 translate-y-[50%] cursor-pointer rounded-full bg-black/20 p-2  text-2xl text-white group-hover:block">
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div>
      <div className="top-4 flex justify-center py-2">
        {followingUsersReviews.map((_, index) => {
          return (
            <div
              className={
                currentIndex === index
                  ? 'cursor-pointer text-2xl text-slate-300'
                  : 'cursor-pointer text-2xl hover:text-slate-300'
              }
              key={index}
              onClick={() => handleChangeSlide(index)}
            >
              <RxDotFilled />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Carousel

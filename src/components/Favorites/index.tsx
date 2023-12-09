import { MdOutlineFavoriteBorder } from 'react-icons/md'
import useMoviesDetailStore from '../../store/moviesDetailStore'
import useUserStore from '../../store/userStore'
import { db } from '../../../firebase'
import { setDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore'

interface FavoritesState {
  isFavorites: boolean
  movieId: string
}

const Favorites = (Props: FavoritesState) => {
  const { user } = useUserStore()
  const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)

  const handleAddToFavorites = async () => {
    const favoritesData = {
      user: user.userId,
      movie_id: Props.movieId,
      movie_title: moviesDetail.title,
      movie_original_title: moviesDetail.original_title,
      movie_backdrop_path: moviesDetail.backdrop_path,
      movie_poster: moviesDetail.poster_path,
      movie_release: moviesDetail.release_date,
      created_at: serverTimestamp(),
      schedule_time: 'unscheduled',
    }
    const userRef = doc(db, 'USERS', user.userId, 'FAVORITES', Props.movieId)
    await setDoc(userRef, favoritesData)
  }

  const handleRemoveFavorites = async () => {
    const userRef = doc(db, 'USERS', user.userId, 'FAVORITES', Props.movieId)
    await deleteDoc(userRef)
  }

  const handleClickFavorite = (isFavorites: boolean) => {
    if (isFavorites) {
      handleRemoveFavorites()
    } else {
      handleAddToFavorites()
    }
  }

  return (
    <div
      className={`${
        Props.isFavorites ? 'text-red-600' : 'text-[#94a3ab]'
      } flex cursor-pointer flex-col items-center
        hover:text-[#475565]`}
      onClick={() => handleClickFavorite(Props.isFavorites)}
    >
      <MdOutlineFavoriteBorder className="text-4xl" />
      <span className="text-xs">收藏</span>
    </div>
  )
}

export default Favorites

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()
  const isProfilePage = pathname.includes('profile')
  const isMoviesCastPage = pathname.includes('cast')
  const isMoviesCrewPage = pathname.includes('crew')
  const isMoviesDetailsPage = pathname.includes('details')

  useEffect(() => {
    if (
      !isProfilePage &&
      !isMoviesCastPage &&
      !isMoviesCrewPage &&
      !isMoviesDetailsPage
    ) {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}

export default ScrollToTop

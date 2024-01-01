import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()
  const isProfilePage =
    pathname.includes('discover') ||
    pathname.includes('activity') ||
    pathname.includes('network') ||
    pathname.includes('likes') ||
    pathname.includes('calendar') ||
    pathname.includes('setting')
  const isMoviesPage =
    pathname.includes('cast') ||
    pathname.includes('crew') ||
    pathname.includes('details')

  useEffect(() => {
    if (!isProfilePage && !isMoviesPage) {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}

export default ScrollToTop

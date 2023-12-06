import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import useUserStore from './store/userStore'
// import ScrollToTop from './components/ScrollToTop/index.tsx'

function App() {
  const { isLogin, checkIfLogin, getUserProfile } = useUserStore()

  useEffect(() => {
    checkIfLogin()
    if (isLogin) {
      getUserProfile()
    }
  }, [isLogin])

  return (
    <>
      {/* <ScrollToTop /> */}
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default App

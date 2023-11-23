import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import useUserStore from './store/userStore'

function App() {
    const { isLogin, user, checkIfLogin, getUserProfile } = useUserStore()

    useEffect(() => {
        checkIfLogin()
        if (isLogin) {
            getUserProfile()
        }
    }, [isLogin])

    console.log('user',user)
    
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}

export default App

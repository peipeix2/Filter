import { auth } from '../../../firebase'
import { signOut } from 'firebase/auth'
import useUserStore from '../../store/userStore'

const Logout = () => {
  const resetUser = useUserStore((state) => state.resetUser)

  const handleLogout = async () => {
    await signOut(auth)
    resetUser()
    localStorage.removeItem('user')
    alert('You has been logged out.')
  }

  return <span onClick={handleLogout}>登出</span>
}

export default Logout

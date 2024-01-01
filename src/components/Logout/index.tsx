import { auth } from '../../../firebase'
import { signOut } from 'firebase/auth'
import useUserStore from '../../store/userStore'
import toast from 'react-hot-toast'

const Logout = () => {
  const resetUser = useUserStore((state) => state.resetUser)

  const handleLogout = async () => {
    await signOut(auth)
    resetUser()
    localStorage.removeItem('user')
    toast.success('You has been logged out.')
  }

  return (
    <div className="w-full" onClick={handleLogout}>
      <span>登出</span>
    </div>
  )
}

export default Logout

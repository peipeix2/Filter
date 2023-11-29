import { auth } from '../../../firebase'
import { signOut } from 'firebase/auth'
import useUserStore from '../../store/userStore'
import { IoLogOutSharp } from 'react-icons/io5'

const Logout = () => {
  const resetUser = useUserStore((state) => state.resetUser)

  const handleLogout = async () => {
    await signOut(auth)
    resetUser()
    localStorage.removeItem("user")
    alert('You has been logged out.')
  }

  return <IoLogOutSharp className='text-3xl text-zinc-400' onClick={handleLogout} />
}

export default Logout

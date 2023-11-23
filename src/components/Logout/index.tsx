import { auth } from '../../../firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
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

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid
      console.log('user is logged in', uid)
    } else {
      console.log('user has signed out.')
    }
  })

  return <IoLogOutSharp className='text-3xl text-zinc-400' onClick={handleLogout} />
}

export default Logout

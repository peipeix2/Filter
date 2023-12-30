import { useState } from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from '@nextui-org/react'
import SignUp from '../SignUp'
import SignIn from '../SignIn'
import Logout from '../Logout'
import useUserStore from '../../store/userStore'
import SearchBar from '../../pages/Home/SearchBar'
import { Link } from 'react-router-dom'
import { CiSearch } from 'react-icons/ci'

function Header() {
  const { user, isLogin } = useUserStore()
  const [openSearchBar, setOpenSearchBar] = useState<boolean>(false)

  const handleToggleSearchBar = () => {
    setOpenSearchBar(!openSearchBar)
  }

  if (!user) return

  return (
    <Navbar
      className="relative items-center bg-white p-2 shadow-lg lg:px-32"
      maxWidth="full"
      height="90px"
      position="sticky"
      isBordered
    >
      <NavbarBrand>
        <Link to="/">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/filter-14ea1.appspot.com/o/Filter-logos_transparent_cut.png?alt=media&token=d3119f34-30f8-4afe-8e1c-6e74367acf7c"
            alt="site-logo"
            className="h-auto w-[100px] md:w-[300px]"
          />
        </Link>
      </NavbarBrand>

      <NavbarContent
        className="flex w-full items-center gap-5 md:w-2/3"
        justify="end"
      >
        <div
          className={` ${
            openSearchBar ? 'absolute left-0 top-5 z-10 w-full' : 'hidden'
          } md:block md:w-2/3`}
        >
          <SearchBar />
        </div>
        <div
          className={` ${
            openSearchBar
              ? 'fixed left-0 top-0 h-screen w-screen bg-slate-800/60'
              : 'hidden'
          }`}
          onClick={handleToggleSearchBar}
        />
        <div className="md:hidden">
          <CiSearch size={18} color="#718096" onClick={handleToggleSearchBar} />
        </div>
        {!isLogin && (
          <>
            <SignUp />
            <SignIn />
          </>
        )}
        {isLogin && (
          <>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="default"
                  name={user.username ? user.username : 'Guest'}
                  size="sm"
                  src={user.avatar}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">歡迎你 {user.username}</p>
                  <p className="font-semibold">{user.email}</p>
                </DropdownItem>
                <DropdownItem
                  key="profile"
                  href={`/profile/${user.userId}/activity`}
                >
                  個人頁面
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  <Logout />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        )}
      </NavbarContent>
    </Navbar>
  )
}

export default Header

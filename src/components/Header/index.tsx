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
import SubNavbar from '../../pages/Home/SubNavbar'

function Header() {
  const { user, isLogin } = useUserStore()

  if (!user) return

  return (
    <Navbar
      className="items-center bg-white px-32 shadow-lg"
      maxWidth="full"
      height="90px"
      position="sticky"
      isBordered
    >
      <NavbarBrand>
        <a href="/">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/filter-14ea1.appspot.com/o/Filter-logos_transparent_cut.png?alt=media&token=d3119f34-30f8-4afe-8e1c-6e74367acf7c"
            alt="site-logo"
            className="h-auto w-[300px]"
          />
        </a>
      </NavbarBrand>

      <NavbarContent className="flex w-2/3 items-center gap-5" justify="end">
        <SubNavbar />
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
                  <p className="font-semibold">Signed in as {user.username}</p>
                  <p className="font-semibold">{user.email}</p>
                </DropdownItem>
                <DropdownItem
                  key="profile"
                  href={`/profile/${user.userId}/activity`}
                >
                  個人頁面
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Logout />
          </>
        )}
      </NavbarContent>
    </Navbar>
  )
}

export default Header

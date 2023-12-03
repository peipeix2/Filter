import { CiSearch } from 'react-icons/ci'
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    Input,
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
        className="items-center bg-white px-32"
        maxWidth="full"
        height="90px"
        position='static'
      >
        <NavbarBrand>
          <a href="/">SiteLogo</a>
        </NavbarBrand>

        <NavbarContent className='flex items-center w-2/3 gap-5' justify='end'>
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
                    <p className="font-semibold">
                      Signed in as {user.username}
                    </p>
                    <p className="font-semibold">{user.email}</p>
                  </DropdownItem>
                  <DropdownItem key="profile" href={`/profile/${user.userId}`}>
                    個人頁面
                  </DropdownItem>
                  <DropdownItem key="team_settings">Team Settings</DropdownItem>
                  <DropdownItem key="analytics">Analytics</DropdownItem>
                  <DropdownItem key="system">System</DropdownItem>
                  <DropdownItem key="configurations">
                    Configurations
                  </DropdownItem>
                  <DropdownItem key="help_and_feedback">
                    Help & Feedback
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger">
                    Log Out
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

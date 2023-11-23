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

function Header() {
    const { user, isLogin } = useUserStore()

    if (!user) return

    return (
      <Navbar className="bg-slate-200">
        <NavbarBrand>
          <a href="/">SiteLogo</a>
        </NavbarBrand>

        <NavbarContent as="div" justify="end">
          <Input
            classNames={{
              base: 'max-w-full sm:max-w-[10rem] h-10',
              mainWrapper: 'h-full',
              input: 'text-small',
              inputWrapper:
                'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
            }}
            placeholder="全站搜尋"
            size="sm"
            startContent={<CiSearch size={18} />}
            type="search"
          />
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
                  <DropdownItem key="settings">My Settings</DropdownItem>
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

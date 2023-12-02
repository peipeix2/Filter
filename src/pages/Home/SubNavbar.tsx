import { useState } from 'react'
import {
  Navbar,
  NavbarContent,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Button,
  Select,
  SelectItem
} from '@nextui-org/react'
import { CiSearch } from 'react-icons/ci'
import { useNavigate } from 'react-router-dom'

const SubNavbar = () => {
  const [searchInput, setSearchInput] = useState('')
  const [selectedValue, setSelectedValue] = useState('title')
  const navigate = useNavigate()

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchInput.length !== 0 && e.key === 'Enter') {
      if (selectedValue === 'title') {
        navigate(`/search?keyword=${searchInput}`)
      }
      if (selectedValue === 'tag') {
        navigate(`/tag?keyword=${searchInput}`)
      }
    }
  }

  return (
    <Navbar
      position="static"
      className="mx-auto my-5 flex w-4/5 items-center justify-around bg-slate-400"
    >
      <NavbarContent>
        <span>篩選電影</span>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">類型</Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>喜劇</DropdownItem>
            <DropdownItem>劇情</DropdownItem>
            <DropdownItem>動作</DropdownItem>
            <DropdownItem>冒險</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">評分</Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>5分</DropdownItem>
            <DropdownItem>4分</DropdownItem>
            <DropdownItem>3分</DropdownItem>
            <DropdownItem>2分</DropdownItem>
            <DropdownItem>1分</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <div className="flex items-center">
        <Select label="搜尋類別" size='sm' className='w-32' onChange={(e) => setSelectedValue(e.target.value)} selectedKeys={[selectedValue]}>
          <SelectItem key='title' value='title'>片名</SelectItem>
          <SelectItem key='tag' value='tag'>標籤</SelectItem>
        </Select>
        <Input
          classNames={{
            base: 'max-w-full sm:max-w-[10rem] h-10',
            mainWrapper: 'h-full',
            input: 'text-small',
            inputWrapper:
              'h-full font-normal text-default-500 bg-slate-800 dark:bg-default-500/20',
          }}
          placeholder="搜尋電影"
          size="sm"
          startContent={<CiSearch size={18} />}
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyUp={(e) => handleSearch(e)}
        />
      </div>
    </Navbar>
  )
}

export default SubNavbar

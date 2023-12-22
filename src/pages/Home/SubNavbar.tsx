import { useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { useNavigate } from 'react-router-dom'
import { Select, SelectItem } from '@nextui-org/react'

const SubNavbar = () => {
  const [searchInput, setSearchInput] = useState('')
  const [selectedValue, setSelectedValue] = useState('title')
  const navigate = useNavigate()

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchInput.length !== 0) {
      if (selectedValue === 'title') {
        navigate(`/search?keyword=${searchInput}`)
      }
      if (selectedValue === 'tag') {
        navigate(`/tag?keyword=${searchInput}`)
      }
      setSearchInput('')
    }
  }

  return (
    <div className="header-search h-12 w-2/3">
      <div className="search-form flex h-12 items-center rounded-lg bg-[#d2d2d2] p-5">
        <form
          onSubmit={(e) => handleSearchSubmit(e)}
          className="search-form-field flex flex-grow items-center"
        >
          <button type="submit" className="search-form-btn">
            <CiSearch size={18} color="#718096" />
          </button>
          <input
            type="text"
            className="search-form-input w-full border-none bg-[#d2d2d2] px-2 placeholder-gray-500 outline-0 focus:outline-none"
            placeholder="搜尋電影"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
        <div className="search-form-in-category flex items-center">
          <div className="search-form-separator text-[#9da3ae]">|</div>
          <div className="search-form-dropdown">
            <Select
              size="sm"
              className="min-w-[100px]"
              classNames={{
                innerWrapper: 'bg-[#d2d2d2]',
                trigger: [
                  'data-[hover=true]:bg-[#d2d2d2]',
                  'bg-[$d2d2d2] border-none shadow-none',
                ],
              }}
              selectedKeys={[selectedValue]}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <SelectItem key="title" value="title">
                片名
              </SelectItem>
              <SelectItem key="tag" value="tag">
                標籤
              </SelectItem>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubNavbar

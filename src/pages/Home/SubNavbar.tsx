import { useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { useNavigate } from 'react-router-dom'
import { Kbd } from '@nextui-org/react'

const SubNavbar = () => {
  const [searchInput, setSearchInput] = useState('')
  const [selectedValue, setSelectedValue] = useState('title')
  const navigate = useNavigate()

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isEnterKey = e.key === 'Enter'
    console.log(e.metaKey)
    if (searchInput.length !== 0 && (e.metaKey || e.ctrlKey) && isEnterKey) {
      console.log('get')
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
        <div className="search-form-field flex flex-grow items-center">
          <button className="search-form-btn">
            <CiSearch size={18} color="#718096" />
          </button>
          <input
            type="text"
            className="search-form-input w-full border-none bg-[#d2d2d2] px-2 placeholder-gray-500 outline-0 focus:outline-none"
            placeholder="搜尋電影"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => handleSearch(e)}
          />
          <Kbd
            className="mr-2"
            keys={['command', 'enter']}
            classNames={{
              base: 'bg-[#d2d2d2] text-gray-500 shadow-none border-0',
            }}
          ></Kbd>
        </div>
        <div className="search-form-in-category flex items-center">
          <div className="search-form-separator text-[#9da3ae]">|</div>
          <div className="search-form-dropdown">
            <select
              className="focus: border-none bg-[#d2d2d2] px-3 text-sm text-[#222222] outline-none"
              onChange={(e) => setSelectedValue(e.target.value)}
              defaultValue={[selectedValue]}
            >
              <option value="title">片名</option>
              <option value="tag">標籤</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubNavbar

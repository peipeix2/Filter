import { useState } from 'react'
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
    <div className="header-search h-12 w-2/3">
      <div className="search-form flex h-12 items-center rounded-lg bg-[#d2d2d2] p-5">
        <div className="search-form-field flex flex-grow items-center">
          <button className="search-form-btn">
            <CiSearch size={18} color="#9da3ae" />
          </button>
          <input
            type="text"
            className="search-form-input focus: w-full bg-[#d2d2d2] px-2 outline-none"
            placeholder="搜尋電影"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyUp={(e) => handleSearch(e)}
          />
        </div>
        <div className="search-form-in-category flex items-center">
          <div className="search-form-separator text-[#475565]">|</div>
          <div className="search-form-dropdown">
            <select
              className="focus: bg-[#d2d2d2] px-3 text-sm outline-none"
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

import { Chip } from '@nextui-org/react'
import { FaTag } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

interface TagState {
  tag: string
  index: number
}

const Tag = (Props: TagState) => {
  return (
    <Link to={`/tag?keyword=${Props.tag}`}>
      <Chip
        className="bg-[#94a3ab] p-1 text-xs text-slate-100"
        key={Props.index}
        size="sm"
        startContent={<FaTag size={12} color="#f2f5f9" />}
      >
        {Props.tag}
      </Chip>
    </Link>
  )
}

export default Tag

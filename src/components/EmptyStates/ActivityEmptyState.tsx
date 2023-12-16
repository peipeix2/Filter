import { Link } from 'react-router-dom'

const ActivityEmptyState = () => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-slate-100 p-6">
      <img src="/home_cinema.svg" className="h-[150px] w-[150px]" />
      <p className="text-sm font-bold text-[#94a3ab]">多久沒有看電影了呢？</p>
      <Link to={`/popular`} className="text-sm font-bold text-[#f46854]">
        看看現在的熱門電影
      </Link>
    </div>
  )
}

export default ActivityEmptyState

const ScheduledEmptyState = () => {
  return (
    <div className="flex min-h-[230px] w-full flex-col items-center justify-center gap-4 rounded-xl bg-slate-100 p-6">
      <img src="/void.svg" className="h-[150px] w-[150px]" />
      <p className="text-sm font-bold text-[#94a3ab]">
        你現在沒有任何排期的收藏！
      </p>
    </div>
  )
}

export default ScheduledEmptyState

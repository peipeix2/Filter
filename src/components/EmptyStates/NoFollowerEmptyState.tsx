const NoFollowerEmptyState = () => {
  return (
    <div className="mt-5 flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-slate-100 p-6">
      <img
        src="/undraw_conversation_re_c26v.svg"
        className="h-[150px] w-[150px]"
      />
      <p className="text-sm font-bold text-[#94a3ab]">你還沒有發摟任何人！</p>
    </div>
  )
}

export default NoFollowerEmptyState

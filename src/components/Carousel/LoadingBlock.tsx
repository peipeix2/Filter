import { Skeleton } from '@nextui-org/react'

const LoadingBlock = () => {
  return (
    <Skeleton>
      <div className="group relative m-auto h-[780px] w-full max-w-[1920px] py-16 "></div>
    </Skeleton>
  )
}

export default LoadingBlock

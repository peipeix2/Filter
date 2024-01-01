import { Skeleton } from '@nextui-org/react'

const LoadingMode = () => {
  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 top-16 flex h-[652px] w-full flex-col justify-center overflow-hidden bg-black/[.5] bg-fixed">
        <div className="mx-auto w-[1200px] max-w-[1200px]">
          <div className="title-content w-2/5">
            <Skeleton>
              <div className="h-3 w-1/3"></div>
            </Skeleton>
            <Skeleton>
              <div className="h-12 w-2/3"></div>
            </Skeleton>
            <Skeleton>
              <div className="mt-10 h-4 w-2/3"></div>
            </Skeleton>
          </div>
          <div className="author-avatar">
            <Skeleton>
              <div className="h-4 w-1/3"></div>
            </Skeleton>
          </div>
          <Skeleton>
            <div className="mt-5 h-6 w-[100px]"></div>
          </Skeleton>
        </div>
      </div>
      <Skeleton>
        <div className="absolute bottom-20 right-5 h-4 w-1/3"></div>
      </Skeleton>
    </>
  )
}

export default LoadingMode

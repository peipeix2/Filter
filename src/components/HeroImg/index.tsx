import { Link } from 'react-router-dom'

interface HeroImgState {
  backdrop: string
}

const HeroImg = (Props: HeroImgState) => {
  return (
    <div
      className="group relative h-[600px] w-full bg-cover bg-fixed bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${Props.backdrop})`,
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-transparent bg-fixed opacity-50 hover:bg-white"></div>
      <div className="mx-auto flex h-full w-3/5 flex-col items-center justify-center">
        <p className="text-left text-[50px] font-thin leading-none text-white opacity-0 group-hover:opacity-100">
          Social Network for
        </p>
        <p className="text-left text-[150px] font-bold italic leading-none text-white opacity-0 group-hover:opacity-100">
          Film Lovers
        </p>
        <div className="relative flex w-full justify-center">
          <Link
            to=""
            className="absolute mx-auto mt-10 w-max border border-white bg-white bg-opacity-30 p-4 text-white opacity-0 hover:cursor-pointer hover:bg-opacity-80 group-hover:opacity-100"
          >
            Discover more
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroImg

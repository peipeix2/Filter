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
      <div className="flex h-full items-center justify-center">
        <p className="text-[16px] text-white opacity-0 group-hover:opacity-100">
          Latest
        </p>
      </div>
    </div>
  )
}

export default HeroImg

import FadeIn from '../Animation/FadeEffect'

interface HeroImgState {
  backdrop: string
  handleOnClick: () => void
}

const HeroImg = (Props: HeroImgState) => {
  return (
    <div
      className="group relative h-[580px] w-full bg-cover bg-fixed bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${Props.backdrop})`,
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-white bg-fixed opacity-50"></div>
      <div className="mx-auto flex h-full w-3/5 flex-col items-center justify-center">
        <FadeIn direction="down" delay={0.2} fullWidth={false} padding={false}>
          <p className="text-left text-[50px] font-thin leading-none text-white">
            Social Network for
          </p>
        </FadeIn>
        <FadeIn direction="down" delay={0.25} fullWidth={false} padding={false}>
          <p className="text-left text-[150px] font-bold italic leading-none text-white">
            Film Lovers
          </p>
        </FadeIn>
        <FadeIn direction="up" delay={0.25} fullWidth={false} padding={false}>
          <div className="relative flex w-full justify-center">
            <span
              onClick={Props.handleOnClick}
              className="absolute mx-auto mt-10 w-max border border-white bg-white bg-opacity-30 p-4 text-white hover:cursor-pointer hover:bg-opacity-80"
            >
              Discover more
            </span>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

export default HeroImg

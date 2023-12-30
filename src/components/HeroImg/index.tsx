import FadeIn from '../Animation/FadeEffect'

interface HeroImgState {
  backdrop: string
  handleOnClick: () => void
}

const HeroImg = (Props: HeroImgState) => {
  return (
    <div
      className="group relative h-[300px] w-full bg-cover bg-fixed bg-center bg-no-repeat lg:h-[580px] lg:bg-cover"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${Props.backdrop})`,
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 top-0 h-[300px] w-full overflow-hidden bg-white bg-fixed opacity-50 lg:h-full"></div>
      <div className="mx-auto flex h-[300px] w-4/5 flex-col items-center justify-center lg:h-full lg:w-3/5">
        <FadeIn direction="down" delay={0.2} fullWidth={false} padding={false}>
          <p className="text-left text-2xl font-thin leading-none text-white lg:text-[50px]">
            Social Network for
          </p>
        </FadeIn>
        <FadeIn direction="down" delay={0.25} fullWidth={false} padding={false}>
          <p className="text-left text-5xl font-bold italic leading-none text-white lg:text-[120px] xl:text-[150px]">
            Film Lovers
          </p>
        </FadeIn>
        <FadeIn direction="up" delay={0.25} fullWidth={false} padding={false}>
          <div className="relative flex w-full justify-center">
            <span
              onClick={Props.handleOnClick}
              className="absolute mx-auto mt-10 w-max border border-white bg-white bg-opacity-30 p-2 text-xs text-white hover:cursor-pointer hover:bg-opacity-80 lg:p-4 lg:text-base"
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

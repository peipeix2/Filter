import FadeIn from '../../components/Animation/FadeEffect'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div
      className="group relative mt-20 h-[450px] w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original/pS4oSxn9g0PAzkWD5zrSOuRIgT6.jpg)`,
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-white bg-fixed opacity-50"></div>
      <div className="mx-auto flex h-full w-3/5 flex-col items-center justify-center">
        <FadeIn direction="down" delay={0.2} fullWidth={false} padding={false}>
          <p className="text-left text-[150px] font-thin leading-none text-white">
            Are You Lost ?
          </p>
        </FadeIn>
        {/* <FadeIn direction="down" delay={0.25} fullWidth={false} padding={false}>
          <p className="text-left text-[150px] font-bold italic leading-none text-white">
            Film Lovers
          </p>
        </FadeIn> */}
        <FadeIn direction="up" delay={0.25} fullWidth={false} padding={false}>
          <div className="relative mt-5 flex w-full justify-center">
            <p className="text-left text-xl font-thin leading-none text-white">
              Ooops! 本頁面不存在
            </p>
          </div>
        </FadeIn>
        <FadeIn direction="up" delay={0.25} fullWidth={false} padding={false}>
          <Link
            to={`/movies/798286`}
            className="relative mt-5 flex w-full justify-center text-white hover:text-gray-500"
          >
            <span className="text-left text-sm font-thin leading-none ">
              《寶可噩夢》
            </span>
            <span className="text-left text-sm font-thin italic leading-none">
              Beau is Afraid
            </span>
          </Link>
        </FadeIn>
      </div>
    </div>
  )
}

export default ErrorPage

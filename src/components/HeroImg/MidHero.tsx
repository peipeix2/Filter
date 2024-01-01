import { SlNotebook } from 'react-icons/sl'
import { FaUserGroup, FaTag } from 'react-icons/fa6'
import useUserStore from '../../store/userStore'
import FadeIn from '../Animation/FadeEffect'

interface HeroImgState {
  backdrop: string
}

const MidHero = (Props: HeroImgState) => {
  const { isLogin, user } = useUserStore()

  return (
    <>
      <div
        className="group relative h-[400px] w-full bg-cover bg-fixed bg-center
        bg-no-repeat"
        style={{
          backgroundImage: `url(${Props.backdrop})`,
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-black/[.5] bg-fixed">
          <div className="content mt-5 flex w-full flex-col justify-center md:mt-20">
            <FadeIn
              direction="down"
              delay={0.25}
              fullWidth={false}
              padding={false}
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/filter-14ea1.appspot.com/o/Filter-logos_white_cut.png?alt=media&token=199ba25c-f542-4309-9aa2-62c63c8063e9"
                className="mx-auto h-auto w-[250px] opacity-50 md:w-[300px]"
              />
            </FadeIn>
            {isLogin ? (
              <FadeIn
                direction="up"
                delay={0.3}
                fullWidth={false}
                padding={false}
              >
                <div className="features mt-16 flex items-center justify-center md:mt-10">
                  <div className="flex flex-col items-center gap-10 md:flex-row md:items-baseline">
                    <span className="text-5xl font-thin italic text-gray-200">
                      Welcome back
                    </span>
                    <span className="text-5xl font-extrabold text-white">
                      {user.username}
                    </span>
                  </div>
                </div>
              </FadeIn>
            ) : (
              <FadeIn
                direction="up"
                delay={0.3}
                fullWidth={false}
                padding={false}
              >
                <div className="features mt-5 flex flex-col justify-center gap-5 md:mt-10 md:flex-row md:gap-20">
                  <div className="feature-card flex max-w-xs items-center justify-between text-white opacity-70 md:flex-col md:justify-center">
                    <div className="flex items-center md:flex-col">
                      <SlNotebook className="text-2xl md:text-5xl" />
                      <p className="ml-2 text-sm font-extrabold md:ml-0 md:mt-5 md:text-base">
                        電影筆記
                      </p>
                    </div>
                    <div className="w-1/2 md:w-2/3 md:text-center">
                      <span className="text-center text-xs leading-relaxed md:mt-3 md:text-sm">
                        提供公開/私人模式自由切換，你的觀後感，可以是悄悄話，也可以昭告天下
                      </span>
                    </div>
                  </div>
                  <div className="feature-card flex max-w-xs items-center justify-between text-white opacity-70 md:flex-col md:justify-center">
                    <div className="flex items-center md:flex-col">
                      <FaUserGroup className="text-2xl md:text-5xl" />
                      <p className="ml-2 text-sm font-extrabold md:ml-0 md:mt-5 md:text-base">
                        好友社群
                      </p>
                    </div>
                    <div className="w-1/2 md:w-2/3 md:text-center">
                      <span className="text-center text-xs leading-relaxed md:mt-3 md:text-sm">
                        好友動態自動推送、輕鬆追蹤社群同好，挖掘有趣靈魂簡簡單單
                      </span>
                    </div>
                  </div>
                  <div className="feature-card flex max-w-xs items-center justify-between text-white opacity-70 md:flex-col md:justify-center">
                    <div className="flex items-center md:flex-col">
                      <FaTag className="text-2xl md:text-5xl" />
                      <p className="ml-2 text-sm font-extrabold md:ml-0 md:mt-5 md:text-base">
                        自訂標籤
                      </p>
                    </div>
                    <div className="w-1/2 md:w-2/3 md:text-center">
                      <span className="text-center text-xs leading-relaxed md:mt-3 md:text-sm">
                        為看過的影片打上自訂tag，並支持標籤搜尋功能，隨時隨地搜尋同類影片
                      </span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default MidHero

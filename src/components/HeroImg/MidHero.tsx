import { SlNotebook } from 'react-icons/sl'
import { FaUserGroup, FaTag } from 'react-icons/fa6'
import useUserStore from '../../store/userStore'
import FadeIn from '../Animation/Fadein'

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
          <div className="content mt-20 flex w-full flex-col justify-center">
            <FadeIn
              direction="down"
              delay={0.25}
              fullWidth={false}
              padding={false}
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/filter-14ea1.appspot.com/o/Filter-logos_white_cut.png?alt=media&token=199ba25c-f542-4309-9aa2-62c63c8063e9"
                className="mx-auto h-auto w-[300px] opacity-50"
              />
            </FadeIn>
            {isLogin ? (
              <FadeIn
                direction="up"
                delay={0.3}
                fullWidth={false}
                padding={false}
              >
                <div className="features mt-10 flex justify-center">
                  <div className="flex items-baseline gap-10">
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
                <div className="features mt-10 flex justify-center gap-20">
                  <div className="feature-card flex max-w-xs flex-col items-center justify-center text-white opacity-70">
                    <SlNotebook className="text-5xl" />
                    <p className="mt-5 font-extrabold">電影筆記</p>
                    <span className="mt-3 text-center text-sm leading-relaxed">
                      提供公開/私人模式自由切換，你的觀後感，可以是悄悄話，也可以昭告天下
                    </span>
                  </div>
                  <div className="feature-card flex max-w-xs flex-col items-center justify-center text-white opacity-70">
                    <FaUserGroup className="text-5xl" />
                    <p className="mt-5 font-extrabold">好友社群</p>
                    <span className="mt-3 text-center text-sm leading-relaxed">
                      好友動態自動推送、輕鬆追蹤社群同好，挖掘有趣靈魂簡簡單單
                    </span>
                  </div>
                  <div className="feature-card flex max-w-xs flex-col items-center justify-center text-white opacity-70">
                    <FaTag className="text-5xl" />
                    <p className="mt-5 font-extrabold">自訂標籤</p>
                    <span className="mt-3 text-center text-sm leading-relaxed">
                      為看過的影片打上自訂tag，並支持標籤搜尋功能，隨時隨地搜尋同類影片
                    </span>
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

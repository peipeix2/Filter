import useUserStore from "../../store/userStore"
import { Avatar, Divider, Button } from '@nextui-org/react'
import { Link, Outlet } from "react-router-dom"

const Profile = () => {
  const user = useUserStore((state) => state.user)

  const profileTabLinks = ['Discover', 'Activity', 'Watchlist', 'Calender', "Customize"]

  return (
    <>
      <div
        style={{
          backgroundImage: `url('https://image.tmdb.org/t/p/original/mRmRE4RknbL7qKALWQDz64hWKPa.jpg')`,
        }}
        className="w-100% h-[500px] bg-cover bg-center bg-no-repeat"
      />
      <section className="profile mx-auto mt-10 flex w-4/5 flex-col">
        <div className="header flex w-full items-center justify-between">
          <div className="profile flex items-center">
            <div className="profile-info flex items-baseline">
              <Avatar src={user.avatar} size="lg" />
              <p>{user.username}</p>
            </div>
            <Button size="sm" className='ml-5'>Follow</Button>
          </div>

          <div className="follows-data flex gap-2">
            <div className="comments-count flex flex-col items-center">
              <span>評論數</span>
              <span>0</span>
            </div>
            <div className="reviews-count flex flex-col items-center">
              <span>影評數</span>
              <span>0</span>
            </div>
            <div className="followers-count flex flex-col items-center">
              <span>我的追蹤</span>
              <span>0</span>
            </div>
            <div className="following-count flex flex-col items-center">
              <span>粉絲人數</span>
              <span>0</span>
            </div>
          </div>
        </div>

        <div className="tab mx-auto mb-5 mt-20 flex w-1/2 justify-evenly">
          {profileTabLinks.map((tab, index) => {
            return (
              <Link
                to={`./${tab.toLowerCase()}`}
                key={index}
                className="text-md font-['DM_Serif_Display'] tracking-wide"
              >
                {tab}
              </Link>
            )
          })}
        </div>

        <Divider className="mx-auto w-1/2" />

        <div className='w-3/5 mx-auto mt-20'>
          <Outlet />
        </div>
      </section>
    </>
  )
}

export default Profile
import { Divider, User } from '@nextui-org/react'
import { Link } from 'react-router-dom'

const users = [
  {
    userId: 'xez',
    username: '王大明',
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/filter-14ea1.appspot.com/o/profile_1.png?alt=media&token=98fed3b8-b6bb-4720-8d65-961d4a21cfcf',
  },
  {
    userId: 'abc',
    username: '李小美',
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/filter-14ea1.appspot.com/o/profile_2.png?alt=media&token=686fb299-865f-44d4-ac40-97733a4f3b2c',
  },
  {
    userId: 'abc',
    username: '林同學',
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/filter-14ea1.appspot.com/o/profile_3.png?alt=media&token=02b85b8c-aaba-4564-b853-130757267fee',
  },
  {
    userId: 'abc',
    username: '吳老師',
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/filter-14ea1.appspot.com/o/profile_4.png?alt=media&token=43ef5225-efa5-45eb-91c2-56c9aa794466',
  },
  {
    userId: 'abc',
    username: '張大叔',
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/filter-14ea1.appspot.com/o/profile_5.png?alt=media&token=c8cbb391-faf8-4fed-893b-c48d313aaea8',
  },
]

const PopularReviewers = () => {
  return (
    <>
      <div className="title-wrapper flex items-center justify-between">
        <p className="text-base font-semibold text-[#475565]">活躍用戶</p>
        {/* <Link to={`/popular`} className="text-sm text-[#475565]">
          More
        </Link> */}
      </div>
      <Divider className="mt-1" />
      {users.map((user) => {
        return (
          <>
            <Link to={`/profile/${user.userId}`} className="profile-card">
              <User
                name={user.username}
                description={`評論數：10`}
                avatarProps={{
                  src: `${user.avatar}`,
                }}
                className="my-3"
                classNames={{
                  wrapper: 'ml-3',
                }}
              />
            </Link>
            <Divider />
          </>
        )
      })}
    </>
  )
}

export default PopularReviewers

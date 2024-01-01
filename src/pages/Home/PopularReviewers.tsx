import { Divider, User } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { UserProfileState } from '../../utils/type'
import SubCategoryTitle from './SubCategoryTitle'
import firestore from '../../utils/firestore'

const PopularReviewers = () => {
  const [popularUsers, setPopularUsers] = useState<UserProfileState[]>([])

  useEffect(() => {
    const fetchPopularUsers = async () => {
      const data = await firestore.queryPopularUsers('USERS')
      setPopularUsers(data as UserProfileState[])
    }

    fetchPopularUsers()
  }, [])

  if (!popularUsers) return

  return (
    <div className="popular-reviewer-wrapper w-full">
      <SubCategoryTitle subCategory="活躍用戶" />

      <Divider className="mt-1" />
      {popularUsers.map((user, index) => {
        return (
          <div className="popular-user-wrapper">
            <Link
              to={`/profile/${user.userId}`}
              className="profile-card"
              key={index}
            >
              <User
                name={user.username}
                description={`給讚數：${user.likes.length}`}
                avatarProps={{
                  src: `${user.avatar}`,
                }}
                className="my-3"
                classNames={{
                  wrapper: 'ml-3',
                  description: 'text-xs',
                }}
              />
            </Link>
            <Divider />
          </div>
        )
      })}
    </div>
  )
}

export default PopularReviewers

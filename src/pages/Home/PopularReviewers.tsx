import { Divider, User } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { db } from '../../../firebase'
import { query, orderBy, collection, limit, getDocs } from 'firebase/firestore'

const PopularReviewers = () => {
  const [popularUsers, setPopularUsers] = useState<any>([])

  useEffect(() => {
    const queryPopularUsers = async () => {
      const userRef = collection(db, 'USERS')
      const q = query(userRef, orderBy('likes', 'desc'), limit(5))
      const querySnapshot = await getDocs(q)
      const popularUsersData: any = []
      querySnapshot.forEach((doc) => {
        popularUsersData.push(doc.data())
      })
      setPopularUsers(popularUsersData)
    }

    queryPopularUsers()
  }, [])

  if (!popularUsers) return

  return (
    <>
      <div className="title-wrapper flex items-center justify-between">
        <p className="text-base font-semibold text-[#475565]">活躍用戶</p>
        {/* <Link to={`/popular`} className="text-sm text-[#475565]">
          More
        </Link> */}
      </div>
      <Divider className="mt-1" />
      {popularUsers.map((user: any, index: number) => {
        return (
          <>
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

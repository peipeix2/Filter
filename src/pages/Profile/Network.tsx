import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase'
import { Avatar, Divider, User, Link } from '@nextui-org/react'
// import { Link } from 'react-router-dom'
import useUserStore from '../../store/userStore'

const Network = () => {
  const { user, userFollowers, userFollowings } = useUserStore()

  return (
    <div>
      <div>
        <h1 className="mb-3">追蹤用戶</h1>
        <div className="user-data-panel min-h-[100px]">
          {userFollowings.map((user) => {
            return (
              <>
                <a href={`/profile/${user.userId}`}>
                  <div className="user-card flex items-center p-2">
                    <Avatar src={user.avatar} className="mr-2" />
                    <span>{user.username}</span>
                  </div>
                </a>
                <Divider />
              </>
            )
          })}
        </div>
      </div>
      <div>
        <h1 className="mb-3">粉絲</h1>
        <div className="user-data-panel min-h-[100px]">
          {userFollowers.map((user) => {
            return (
              <>
                <a href={`/profile/${user.userId}`}>
                  <div className="user-card flex items-center p-2">
                    <Avatar src={user.avatar} className="mr-2" />
                    <span>{user.username}</span>
                  </div>
                </a>
                <Divider />
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Network

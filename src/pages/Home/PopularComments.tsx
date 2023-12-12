import { useState, useEffect } from 'react'
import {
  collectionGroup,
  getDocs,
  orderBy,
  query,
  limit,
} from 'firebase/firestore'
import { db } from '../../../firebase'
import { Divider, Skeleton } from '@nextui-org/react'
import useUserStore from '../../store/userStore'
import PopularReviewers from './PopularReviewers'
import CommentCard from '../../components/CommentCard'
import FadeInOnce from '../../components/Animation/FadeInOnce'

const PopularComments = () => {
  const [followingUsersComments, setFollowingUsersComments] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    fetchPopularComments()
  }, [])

  const queryPopularComments = async () => {
    const commentRef = collectionGroup(db, 'COMMENTS')
    const q = query(commentRef, orderBy('likes_count', 'desc'), limit(5))
    const querySnapshot = await getDocs(q)
    const data: any = []
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() })
    })
    return data
  }

  const fetchPopularComments = async () => {
    setIsLoading(true)
    const data = await queryPopularComments()
    setIsLoading(false)
    setFollowingUsersComments(data)
  }

  return (
    <div className="popular-comments-container mt-20 flex justify-between">
      <section className="popular-comments w-2/3">
        <div className="title-wrapper flex items-center justify-between">
          <p className="text-base font-semibold text-[#475565]">熱門評論</p>
        </div>
        <Divider className="mt-1" />

        {isLoading &&
          Array(5)
            .fill('')
            .map((_, index) => {
              return (
                <Skeleton className="w-full max-w-[165px]" key={index}>
                  <div className="w-full max-w-[165px]"></div>
                </Skeleton>
              )
            })}

        <FadeInOnce
          direction="right"
          delay={0.25}
          fullWidth={false}
          padding={false}
        >
          {followingUsersComments.map((post: any, index: number) => {
            return (
              <CommentCard
                post={post}
                followingUsersComments={followingUsersComments}
                setFollowingUsersComments={setFollowingUsersComments}
                currentUserId={user.userId}
                key={index}
              />
            )
          })}
        </FadeInOnce>
      </section>

      <section className="popular-reviewers w-1/5">
        <FadeInOnce
          direction="left"
          delay={0.25}
          fullWidth={false}
          padding={false}
        >
          <PopularReviewers />
        </FadeInOnce>
      </section>
    </div>
  )
}

export default PopularComments

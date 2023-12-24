import { useState, useEffect } from 'react'
import { Divider, Skeleton } from '@nextui-org/react'
import useUserStore from '../../store/userStore'
import PopularReviewers from './PopularReviewers'
import CommentCard from '../../components/CommentCard'
import FadeInOnce from '../../components/Animation/FadeInOnce'
import { CommentState } from '../../utils/type'
import firestore from '../../utils/firestore'
import SubCategoryTitle from './SubCategoryTitle'

const PopularComments = () => {
  const [followingUsersComments, setFollowingUsersComments] = useState<
    CommentState[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    fetchPopularComments()
  }, [])

  const fetchPopularComments = async () => {
    setIsLoading(true)
    const data = await firestore.queryPopularPosts('COMMENTS')
    setIsLoading(false)
    setFollowingUsersComments(data as CommentState[])
  }

  return (
    <div className="popular-comments-container mt-20 flex justify-between">
      <section className="popular-comments w-2/3">
        <FadeInOnce
          direction="right"
          delay={0.25}
          fullWidth={false}
          padding={false}
        >
          <div className="title-wrapper flex items-center justify-between">
            <SubCategoryTitle subCategory="熱門評論" />
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

          {followingUsersComments.map((post, index) => {
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

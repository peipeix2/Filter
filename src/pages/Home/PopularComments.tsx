import { useEffect, useState } from 'react'
import {
  collectionGroup,
  getDocs,
  orderBy,
  query,
  where,
  limit,
} from 'firebase/firestore'
import { db } from '../../../firebase'
import { Link } from 'react-router-dom'
import { Divider, Image, User, Skeleton } from '@nextui-org/react'
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt } from 'react-icons/fa'
import DiscoverLikeBtn from '../../components/Like/DiscoverLikeBtn'
import { useQuery } from 'react-query'
import useUserStore from '../../store/userStore'
import PopularReviewers from './PopularReviewers'

const PopularComments = () => {
  const [followingUsersComments, setFollowingUsersComments] = useState('')
  const user = useUserStore((state) => state.user)

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

  const { data, isLoading } = useQuery(
    'getPopularComments',
    queryPopularComments,
    { refetchOnWindowFocus: false }
  )

  if (!data) return

  return (
    <div className="popular-comments-container mt-20 flex justify-between">
      <section className="popular-comments w-2/3">
        <div className="title-wrapper flex items-center justify-between">
          <p className="text-base font-semibold text-[#475565]">熱門評論</p>
          <Link to={`/popular`} className="text-sm text-[#475565]">
            More
          </Link>
        </div>
        <Divider className="mt-1" />

        {isLoading &&
          Array(5)
            .fill('')
            .map((_, index) => {
              ;<Skeleton className="w-full max-w-[165px]" key={index}>
                <div className="w-full max-w-[165px]"></div>
              </Skeleton>
            })}

        {data.map((post: any, index: number) => {
          return (
            <>
              <div className="comment-card my-5 flex items-center" key={index}>
                <div className="avatar-wrapper flex w-[100px] items-start">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${post.movie_poster}`}
                    alt={post.original_title}
                    isBlurred
                  />
                </div>
                <div className="comment-rating ml-10 w-2/3">
                  <div className="movie-info-header mb-2 flex items-baseline text-lg">
                    <h1 className="mr-2 font-bold">{post.movie_title}</h1>
                    <span className="text-sm">{post.movie_original_title}</span>
                  </div>
                  <Link
                    to={`/comment/${post.userId}/${post.id}`}
                    className="w-full"
                  >
                    <div className="comment-header flex items-center">
                      <div className="comment-user mr-2 flex">
                        <span className="mr-1 text-xs text-slate-400">
                          評論作者
                        </span>
                        <span className="text-xs font-semibold text-slate-800">
                          {post.author}
                        </span>
                      </div>

                      <div className="comment-user mr-2 flex">
                        <span className="mr-1 text-xs text-slate-400">
                          評論日期
                        </span>
                        <span className="text-xs font-semibold text-slate-800">
                          {post.created_at.toDate().toDateString()}
                        </span>
                      </div>

                      <CommentStar rating={post.rating} />
                      <div className="comment-count ml-2 flex items-center">
                        <FaCommentAlt className="text-xs" />
                        <span className="ml-1 text-sm">
                          {post.comments_count}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="comment-content my-5">
                    <p className="comment text-sm">{post.comment}</p>
                  </div>

                  <div className="tags">
                    <ul className="flex gap-1">
                      {post.tags.map((tag: string, index: number) => {
                        return (
                          <li
                            className="p-1 text-sm text-slate-400"
                            key={index}
                          >
                            #{tag}
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <DiscoverLikeBtn
                    postId={post.id}
                    count={post.likes_count}
                    authorId={post.userId}
                    isLiked={post.likesUser?.includes(user.userId)}
                    followingUsersComments={followingUsersComments}
                    setFollowingUsersComments={setFollowingUsersComments}
                  />
                </div>
              </div>
              <Divider />
            </>
          )
        })}
      </section>

      <section className="popular-reviewers w-1/5">
        <PopularReviewers />
      </section>
    </div>
  )
}

export default PopularComments

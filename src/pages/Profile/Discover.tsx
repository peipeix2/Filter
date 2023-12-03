import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import {
  collection,
  getDocs,
  collectionGroup,
  where,
  query,
} from 'firebase/firestore'
import { db } from '../../../firebase'
import { Divider, Image } from '@nextui-org/react'
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt } from 'react-icons/fa'
import parser from 'html-react-parser'
import DiscoverLikeBtn from '../../components/Like/DiscoverLikeBtn'
import DiscoverLikeReviewBtn from '../../components/Like/DiscoverLikeReviewBtn'

const Discover = () => {
  const [followingUserIds, setFollowingUserIds] = useState<any>([])
  const [followingUsersComments, setFollowingUsersComments] = useState<any>([])
  const [followingUsersReviews, setFollowingUsersReviews] = useState<any>([])
  const { user } = useUserStore()
  const { userId } = useParams()

  const isCurrentUser = user.userId === userId

  if (!isCurrentUser) {
    return <div>You can only view your own Discover page.</div>
  }

  useEffect(() => {
    fetchFollowingUserIds(userId)
  }, [])

  useEffect(() => {
    if (followingUserIds.length > 0) {
      fetchFollowingUserPosts('COMMENTS').then((comment) =>
        setFollowingUsersComments(comment)
      )
      fetchFollowingUserPosts('REVIEWS').then((review) =>
        setFollowingUsersReviews(review)
      )
    }
  }, [followingUserIds])

  const fetchFollowingUserIds = async (currentUserId: string) => {
    const userFollowingRef = collection(db, 'USERS', currentUserId, 'FOLLOWING')
    const querySnapshot = await getDocs(userFollowingRef)
    const followingIds: any = []
    querySnapshot.forEach((doc) => {
      followingIds.push(doc.id)
    })
    setFollowingUserIds(followingIds)
  }

  const fetchFollowingUserPosts = async (collection: string) => {
    const allPosts: any = []
    for (const followingUserId of followingUserIds) {
      const followingUserPostsQuery = query(
        collectionGroup(db, collection),
        where('userId', '==', followingUserId),
        where('isPublic', '==', true)
      )
      const postsQuerySnapshot = await getDocs(followingUserPostsQuery)

      postsQuerySnapshot.forEach((doc) => {
        const post = doc.data()
        allPosts.push({ id: doc.id, ...post })
      })
    }

    const sortedPosts = allPosts.sort(
      (a: any, b: any) => b.updated_at - a.updated_at
    )
    return sortedPosts
  }

  return (
    <div>
      <h1>他們的評論</h1>
      {followingUsersComments.map((post: any, index: number) => {
        return (
          <div className="comment-card">
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
                  <Link to={`/comment/${post.userId}/${post.id}`}>
                    <div className="comment-header flex">
                      <div className="comment-user mr-2 flex">
                        <span className="mr-1 text-sm text-slate-400">
                          評論作者
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          {post.author}
                        </span>
                      </div>

                      <div className="comment-user mr-2 flex">
                        <span className="mr-1 text-sm text-slate-400">
                          評論日期
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
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
                    <p className="comment">
                      {post.review ? parser(post.review) : null}
                    </p>
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
          </div>
        )
      })}

      <h1 className="mt-20">他們的影評</h1>
      {followingUsersReviews.map((post: any, index: number) => {
        return (
          <div className="comment-card">
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
                  <Link to={`/read/${post.userId}/${post.id}`}>
                    <div className="comment-header flex">
                      <div className="comment-user mr-2 flex">
                        <span className="mr-1 text-sm text-slate-400">
                          評論作者
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          {post.author}
                        </span>
                      </div>

                      <div className="comment-user mr-2 flex">
                        <span className="mr-1 text-sm text-slate-400">
                          評論日期
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
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
                    <p className="comment line-clamp-3 text-sm leading-10">
                      {post.review ? parser(post.review) : null}
                    </p>
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

                  <DiscoverLikeReviewBtn
                    postId={post.id}
                    count={post.likes_count}
                    authorId={post.userId}
                    isLiked={
                      post.likesUser && post.likesUser.includes(user.userId)
                    }
                    followingUsersReviews={followingUsersReviews}
                    setFollowingUsersReviews={setFollowingUsersReviews}
                  />
                </div>
              </div>
              <Divider />
            </>
          </div>
        )
      })}
    </div>
  )
}

export default Discover

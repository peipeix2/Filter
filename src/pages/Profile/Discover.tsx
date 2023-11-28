import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import { collection, getDocs, collectionGroup, where, query, onSnapshot } from 'firebase/firestore'
import { db } from '../../../firebase'
import { Divider, Image } from '@nextui-org/react'
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt, FaHeart } from 'react-icons/fa'
import parser from 'html-react-parser'
import CommentLikeBtn from '../../components/Like/CommentLikeBtn'

const Discover = () => {
  const [followingUserIds, setFollowingUserIds] = useState<any>([])
  const [followingUsersPosts, setFollowingUsersPosts] = useState<any>([])
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
    if(followingUserIds.length > 0) {
      fetchFollowingUserPosts()
    }
  }, [followingUserIds])

  const fetchFollowingUserIds = async(currentUserId:string) => {
    const userFollowingRef = collection(db, 'USERS', currentUserId, 'FOLLOWING')
    const querySnapshot = await getDocs(userFollowingRef)
    const followingIds:any = []
    querySnapshot.forEach(doc => {
      followingIds.push(doc.id)
    })
    setFollowingUserIds(followingIds)
  }

  const fetchFollowingUserPosts = async() => {
    const allPosts:any = []
    for (const followingUserId of followingUserIds) {
      
      const followingUserCommentsQuery = query(
        collectionGroup(db, 'COMMENTS'),
        where('userId', '==', followingUserId)
      )

      const followingUserReviewsQuery = query(
        collectionGroup(db, 'REVIEWS'),
        where('userId', '==', followingUserId)
      )

      const commentsQuerySnapshot = await getDocs(followingUserCommentsQuery)
      const reviewsQuerySnapshot = await getDocs(followingUserReviewsQuery)

      commentsQuerySnapshot.forEach(doc => {
        const post = doc.data()
        allPosts.push({id: doc.id, ...post})
      })
      reviewsQuerySnapshot.forEach(doc => {
        const post = doc.data()
        allPosts.push({id: doc.id, ...post})
      })
    }

    const sortedPosts = allPosts.sort((a:any, b:any) => b.updated_at - a.updated_at)
    setFollowingUsersPosts(sortedPosts)
  }

  return (
    <div>
      <h1>Follow others to see their activities here.</h1>

      <h1>If no followers, show popular comments and reviews from all site.</h1>

      {followingUsersPosts.map((post:any, index:number) => {
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
                <div className="comment-rating ml-10 flex-grow">
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
                    <p className="comment">{post.comment}</p>
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

                  <CommentLikeBtn
                    postId={post.id}
                    count={post.likes_count}
                    authorId={post.userId}
                    isLiked={
                      post.likesUser &&
                      post.likesUser.includes(user.userId)
                    }
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

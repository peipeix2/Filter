import { useEffect, useState } from "react"
import { collectionGroup, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'
import { Link } from "react-router-dom"
import { Divider, Image, User } from "@nextui-org/react"
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt } from 'react-icons/fa'
import DiscoverLikeBtn from "../../components/Like/DiscoverLikeBtn"

const post = {
  movie_poster: '/uYsgrgeosOl9yzIAA0kqYOBm6hv.jpg',
  original_title: 'Monster',
  movie_original_title: 'Monster',
  movie_title: '怪物',
  userId: '1234',
  id: 'xez',
  author: '王小明',
  created_at: Date.now(),
  rating: 5,
  comments_count: 2,
  likes_count: 2,
  comment: 'very good',
  likesUser: ['1','2'],
  tags: ['bromance']
}

const user = {
  userId: 'xez',
  username: '王小明',
  avatar:
    'https://firebasestorage.googleapis.com/v0/b/filter-14ea1.appspot.com/o/default-profile-pic-e1513291410505.jpeg?alt=media&token=cacce2e3-5b21-4b89-96c2-d94003b3063d',
}

const PopularComments = () => {
  const [followingUsersComments, setFollowingUsersComments] = useState('')
  
  const queryPopularComments = async () => {

  }

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
        <>
          <div className="comment-card my-5 flex items-center" key="1">
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
                      2023年12月2日
                      {/* {post.created_at.toDate().toDateString()} */}
                    </span>
                  </div>

                  <CommentStar rating={post.rating} />
                  <div className="comment-count ml-2 flex items-center">
                    <FaCommentAlt className="text-xs" />
                    <span className="ml-1 text-sm">{post.comments_count}</span>
                  </div>
                </div>
              </Link>

              <div className="comment-content my-5">
                <p className="comment">{post.comment}</p>
              </div>

              <div className="tags">
                <ul className="flex gap-1">
                  {post.tags.map((tag: string, index: number) => {
                    return (
                      <li className="p-1 text-sm text-slate-400" key={index}>
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
                isLiked={true}
                followingUsersComments={followingUsersComments}
                setFollowingUsersComments={setFollowingUsersComments}
              />
            </div>
          </div>
          <Divider />
        </>
      </section>

      <section className="popular-reviewers w-1/5">
        <div className="title-wrapper flex items-center justify-between">
          <p className="text-base font-semibold text-[#475565]">活躍用戶</p>
          <Link to={`/popular`} className="text-sm text-[#475565]">
            More
          </Link>
        </div>
        <Divider className="mt-1" />
        <Link to={`/profile/${user.userId}`} className="profile-card">
          <User
            name={user.username}
            description={`評論數：10`}
            avatarProps={{
              src: `${user.avatar}`,
            }}
            className="my-3"
          />
        </Link>
        <Divider />
      </section>
    </div>
  )
}

export default PopularComments

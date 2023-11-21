import { useEffect } from 'react'
import { Divider } from '@nextui-org/react'
import CommentStar from '../../components/Star/CommentStar'
import { FaCommentAlt, FaHeart } from 'react-icons/fa'
import {
    collection,
    onSnapshot,
} from 'firebase/firestore'
import { db } from '../../../firebase'
import useMoviesDetailStore from '../../store/moviesDetailStore'
import useMoviesCommentStore from '../../store/moviesCommentStore'

const CommentsSection = () => {
    const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)
    const moviesCommentsForId = useMoviesCommentStore(
        (state) => state.moviesCommentsForId
    )
    const setMoviesCommentsForId = useMoviesCommentStore(
        (state) => state.setMoviesCommentsForId
    )

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'COMMENTS'),
            (querySnapshot) => {
              const comments:any = []
                querySnapshot.forEach((doc) => {
                    if (doc.data().movie_id === moviesDetail.id && doc.data().isPublic === true) {
                      comments.push(doc.data())
                    }
                })
                setMoviesCommentsForId(comments)
            }
        )

        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <>
            <div>
                <h1>熱門評論</h1>
            </div>
            <Divider className="my-4" />
            {moviesCommentsForId.map((comment, index) => {
              return (
                  <>
                      <div className="comment-card my-5 flex items-center" key={index}>
                          <div className="avatar-wrapper flex h-[100px] w-1/5 items-start">
                              <div
                                  className="avatar mx-auto h-10 w-10 rounded-full bg-contain"
                                  style={{
                                      backgroundImage: `url(${comment.avatar})`,
                                  }}
                              />
                          </div>
                          <div className="comment-rating flex-grow">
                              <div className="comment-header flex">
                                  <div className="comment-user mr-2 flex">
                                      <span className="mr-1 text-sm text-slate-400">
                                          評論作者
                                      </span>
                                      <span className="text-sm font-semibold text-slate-800">
                                          {comment.author}
                                      </span>
                                  </div>
                                  <CommentStar rating={comment.rating} />
                                  <div className="comment-count ml-2 flex items-center">
                                      <FaCommentAlt className="text-xs" />
                                      <span className="ml-1 text-sm">
                                          {comment.comments_count}
                                      </span>
                                  </div>
                              </div>

                              <div className="comment-content my-5">
                                  <p className="comment">{comment.comment}</p>
                              </div>

                              <div className="like">
                                  <div className="like-btn flex items-center">
                                      <FaHeart className="mr-1 text-xs text-slate-800" />
                                      <span className="mr-2 text-xs text-slate-800">
                                          點讚評論
                                      </span>
                                      <span className="text-xs text-slate-500">
                                          {comment.likes_count} 個人點讚
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <Divider />
                  </>
              )
            })}
            
        </>
    )
}

export default CommentsSection

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { query, getDocs, where, collectionGroup } from 'firebase/firestore'
import { db } from '../../../firebase'
import Tag from '../../components/Tag'
import { CommentState } from '../../utils/type'

const TagsSection = () => {
  const [tagsForMovie, setTagsForMovie] = useState<string[]>([])
  const [moviesComments, setMoviesComments] = useState<CommentState[]>([])
  const { id } = useParams()
  let commentsArray: CommentState[] = []

  useEffect(() => {
    const filterPopularTags = async () => {
      await fetchMoviesCommentsAndReviews('COMMENTS')
      await fetchMoviesCommentsAndReviews('REVIEWS')
    }
    filterPopularTags()
  }, [])

  useEffect(() => {
    fetchMovieTags(moviesComments)
  }, [moviesComments])

  const fetchMoviesCommentsAndReviews = async (docName: string) => {
    const ref = collectionGroup(db, docName)
    const q = query(ref, where('movie_id', '==', Number(id)))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      const commentData = doc.data()
      const commentWithId = { ...commentData, id: doc.id }
      commentsArray.push(commentWithId as CommentState)
    })
    setMoviesComments(commentsArray)
  }

  const fetchMovieTags = (moviesComments: CommentState[]) => {
    const movieTags: string[] = []
    moviesComments.forEach((comment) => {
      movieTags.push(...comment.tags)
    })
    const popularTags = filterTags(movieTags)
    setTagsForMovie(popularTags)
  }

  const count = tagsForMovie.reduce((accumulator, value) => {
    accumulator.set(value, (accumulator.get(value) || 0) + 1)
    return accumulator
  }, new Map())

  const filterTags = (tagsForMovie: string[]) => {
    const tagsForRender: string[] = []
    tagsForMovie.forEach((tag) => {
      if (count.get(tag) / tagsForMovie.length > 0.5) {
        tagsForRender.push(tag)
      }
    })
    return tagsForMovie
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {tagsForMovie.map((tag, index) => {
        return <Tag tag={tag} index={index} />
      })}
    </div>
  )
}

export default TagsSection

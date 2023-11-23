import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { collection, query, getDocs, where } from 'firebase/firestore'
import { db } from '../../../firebase'

interface MoviesCommentsForIdState {
  author: string
  avatar: string
  comment: string
  comments_count: number
  created_at: Date
  isPublic: boolean
  likes_count: number
  movie_id: number
  rating: number
  tags: string[]
  updated_at: Date
}

const TagsSection = () => {
  const [tagsForMovie, setTagsForMovie] = useState<string[]>([])
  const [moviesComments, setMoviesComments] =
    useState<MoviesCommentsForIdState[]>([])
  const { id } = useParams()
  const commentsArray: any = []

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


  const fetchMoviesCommentsAndReviews = async (docName:string) => {
    const ref = collection(db, docName)
    const q = query(ref, where('movie_id', '==', Number(id)))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      const commentData = doc.data()
      const commentWithId = { ...commentData, id: doc.id }
      commentsArray.push(commentWithId)
    })
    setMoviesComments(commentsArray)
  }

  const fetchMovieTags = (moviesComments: MoviesCommentsForIdState[]) => {
    const movieTags:string[] = []
    moviesComments.forEach(comment => {
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
    tagsForMovie.forEach(tag => {
      if (count.get(tag) / tagsForMovie.length > 1/2) {
        tagsForRender.push(tag)
      }
    })
    return tagsForMovie
  }


  return (
    <div className='gap-2'>
      {tagsForMovie.map((tag, index) => {
      return (
        <span className='text-sm mr-2' key={index}>#{tag}</span>
      )
    })}
    </div>
    
  )
}

export default TagsSection
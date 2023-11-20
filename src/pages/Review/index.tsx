import { useParams } from 'react-router-dom'
import TextEditor from './TextEditor.jsx'
import useMoviesDetailStore from '../../store/moviesDetailStore'

const Review = () => {
  const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)

  return (
      <>
          <h1>{moviesDetail.title}</h1>
          <span>{moviesDetail.original_title}</span>
          <TextEditor />
      </>
  )
}

export default Review
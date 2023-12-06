import TextEditor from './TextEditor.jsx'
import useMoviesDetailStore from '../../store/moviesDetailStore'
import { Divider } from '@nextui-org/react'

const Review = () => {
  const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)

  return (
    <>
      <div className="title-container mx-auto my-20 max-w-4xl text-center">
        <span className="mr-2 text-2xl font-bold">{moviesDetail.title}</span>
        <span className="font-['DM_Serif_Display'] text-xl">
          {moviesDetail.original_title}
        </span>
        <Divider className="mt-3" />
      </div>

      <TextEditor />
    </>
  )
}

export default Review

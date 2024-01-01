import TextEditor from './TextEditor.jsx'
import useMoviesDetailStore from '../../store/moviesDetailStore'
import { Divider } from '@nextui-org/react'

const Review = () => {
  const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)

  return (
    <>
      <div className="title-container mx-auto my-20 flex w-4/5 flex-col text-center lg:max-w-4xl">
        <span className="mr-2 text-lg font-bold lg:text-2xl">
          {moviesDetail.title}
        </span>
        <span className="font-['DM_Serif_Display'] text-sm lg:text-xl">
          {moviesDetail.original_title}
        </span>
        <Divider className="mt-3" />
      </div>

      <TextEditor />
    </>
  )
}

export default Review

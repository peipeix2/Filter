import { FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { AiOutlineStar } from 'react-icons/ai'

interface Rating {
  rating: number
}

function CommentStar(Props: Rating) {
  const ratingStar = Array.from({ length: 5 }, (_, index) => {
    let number = index + 0.5
    return (
      <span key={index}>
        {Props.rating >= index + 1 ? (
          <FaStar className="text-sm text-[#f46854]" />
        ) : Props.rating >= number ? (
          <FaStarHalfAlt className="text-sm text-[#f46854]" />
        ) : (
          <AiOutlineStar className="mt-[2px] text-sm text-[#f46854]" />
        )}
      </span>
    )
  })

  return (
    <div className="flex items-center justify-start gap-1">{ratingStar}</div>
  )
}

export default CommentStar

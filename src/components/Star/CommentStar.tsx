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
                    <FaStar className="text-sm text-gray-800 text-opacity-50" />
                ) : Props.rating >= number ? (
                    <FaStarHalfAlt className="text-sm text-gray-800 text-opacity-50" />
                ) : (
                    <AiOutlineStar className="text-sm mt-[2px] text-gray-800 text-opacity-50" />
                )}
            </span>
        )
    })

    return (
        <div className="flex items-center justify-start gap-1">
            {ratingStar}
        </div>
    )
}

export default CommentStar

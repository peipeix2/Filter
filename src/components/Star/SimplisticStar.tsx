import { FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { AiOutlineStar } from 'react-icons/ai'

interface Rating {
    rating: number
    count: number
}

function SimplisticStar(Props: Rating) {
    const ratingStar = Array.from({ length: 5 }, (_, index) => {
        let number = index + 0.5
        return (
            <span key={index}>
                {Props.rating >= index + 1 ? (
                    <FaStar className="text-2xl text-gray-800 text-opacity-50" />
                ) : Props.rating >= number ? (
                    <FaStarHalfAlt className="text-2xl text-gray-800 text-opacity-50" />
                ) : (
                    <AiOutlineStar className="mt-[2px] text-3xl text-gray-800 text-opacity-50" />
                )}
            </span>
        )
    })

    return (
        <div className="w-100%">
            <div className="flex items-center justify-start gap-1">
                {ratingStar}
            </div>
        </div>
    )
}

export default SimplisticStar

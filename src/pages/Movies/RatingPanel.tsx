import { useState } from 'react'
import {
    Divider,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Checkbox,
    Input,
    Image,
    Textarea,
} from '@nextui-org/react'
import { IoEyeOutline } from 'react-icons/io5'
import { MdOutlineFavoriteBorder } from 'react-icons/md'
import SimplisticStar from '../../components/Star/SimplisticStar'
import { FaStar } from 'react-icons/fa'
import useMoviesDetailStore from '../../store/moviesDetailStore'
import useMoviesCommentStore from '../../store/moviesCommentStore'
import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    setDoc
} from 'firebase/firestore'
import { db } from '../../../firebase'

interface Rating {
    rating: number
    setRating: () => void
}

const RatingPanel = () => {
    const [hover, setHover] = useState<Rating | null>(null)

    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)
    const moviesComment = useMoviesCommentStore((state) => state.moviesComment)
    const moviesCommentsForId = useMoviesCommentStore((state) => state.moviesCommentsForId)
    const setMoviesComment = useMoviesCommentStore(
        (state) => state.setMoviesComment
    )
    const resetMoviesComment = useMoviesCommentStore(
        (state) => state.resetMoviesComment
    )

    const handleSubmitComment = async () => {
        try {
            const docRef = await addDoc(collection(db, 'COMMENTS'), {
                ...moviesComment,
                author: '001',
                avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
                movie_id: moviesDetail.id,
            })           
            resetMoviesComment()
            console.log('Document written with ID: ', docRef.id)
        } catch (e) {
            console.error('Error adding document: ', e)
        } finally {
          await setDoc(
              doc(db, 'MOVIES', `${moviesDetail.id}`),
              {
                  ratings_count: moviesCommentsForId.length,
                  rating: countRating(),
              },
              { merge: true }
          )
        }
    }

    const countRating = () => {
      const sum = moviesCommentsForId.reduce((acc, comment) => acc + comment.rating, 0)
      const rating = sum / moviesCommentsForId.length
      return rating
    }
    // console.log(moviesComment)

    return (
        <div className="rating-data-wrapper mx-auto w-4/5 bg-slate-100 py-3">
            <div className="watched-status flex justify-around pb-3">
                <div
                    className="flex cursor-pointer flex-col items-center"
                    onClick={onOpen}
                >
                    <IoEyeOutline className="cursor-pointer text-4xl text-[#94a3ab]" />
                    <span className="cursor-pointer text-[10px] text-[#beccdc] hover:text-[#475565]">
                        看過
                    </span>
                </div>
                <div className="flex cursor-pointer flex-col items-center hover:text-[#475565]">
                    <MdOutlineFavoriteBorder className="text-4xl text-[#94a3ab]" />
                    <span className="cursor-pointer text-[10px] text-[#beccdc] hover:text-[#475565]">
                        收藏
                    </span>
                </div>
            </div>

            <Divider />

            <div className="rating-wrapper flex flex-col items-center justify-center py-3">
                <SimplisticStar rating={countRating()} count={1} />
                <p className="mt-2 text-[10px] text-[#beccdc]">評分</p>
            </div>

            <Divider />

            <div className="py-3">
                <p className="text-center text-[14px] text-[#beccdc]">寫影評</p>
            </div>

            <Divider />

            <div className="pt-3">
                <p className="text-center text-[14px] text-[#beccdc]">分享</p>
            </div>

            {/* Modal Form */}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                size="5xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                我看過...
                            </ModalHeader>
                            <ModalBody className="flex flex-row">
                                <Image
                                    src={`https://image.tmdb.org/t/p/w500${moviesDetail.poster_path}`}
                                    alt={moviesDetail.original_title}
                                    className="w-[300px]"
                                    isBlurred
                                />
                                <div className="flex-grow px-10">
                                    <h1 className="mr-2 text-3xl font-bold">
                                        {moviesDetail.title}
                                    </h1>
                                    <p className="mb-5 font-['DM_Serif_Display'] text-2xl">
                                        {moviesDetail.original_title}
                                    </p>
                                    <Textarea
                                        variant="flat"
                                        label="我的評價"
                                        description="字數不可超過150字"
                                        className="mb-5"
                                        value={moviesComment.comment}
                                        onChange={(e) =>
                                            setMoviesComment(
                                                'comment',
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Input
                                        // endContent={
                                        //     <LockIcon className="text-default-400 pointer-events-none flex-shrink-0 text-2xl" />
                                        // }
                                        label="標籤"
                                        placeholder="自訂標籤"
                                        variant="flat"
                                        value={moviesComment.tags}
                                        onChange={(e) =>
                                            setMoviesComment(
                                                'tags',
                                                e.target.value
                                            )
                                        }
                                    />
                                    <div className="rating-privacy mt-5 flex justify-between">
                                        <div className="flex items-center">
                                            <span className="mx-2 text-sm">
                                                評分
                                            </span>
                                            {[...Array(5)].map((_, index) => {
                                                const ratingValue: number =
                                                    index + 1
                                                return (
                                                    <label key={index}>
                                                        <input
                                                            className="hidden"
                                                            type="radio"
                                                            name="score"
                                                            id="score"
                                                            value={ratingValue}
                                                            onClick={() =>
                                                                setMoviesComment(
                                                                    'rating',
                                                                    ratingValue
                                                                )
                                                            }
                                                        />
                                                        <FaStar
                                                            size={30}
                                                            color={
                                                                ratingValue <=
                                                                (hover ||
                                                                    moviesComment.rating)
                                                                    ? 'orange'
                                                                    : '#e4e5e9'
                                                            }
                                                            onMouseEnter={() =>
                                                                setHover(
                                                                    ratingValue
                                                                )
                                                            }
                                                            onMouseLeave={() =>
                                                                setHover(null)
                                                            }
                                                        />
                                                    </label>
                                                )
                                            })}
                                        </div>

                                        <div className="flex justify-between px-1 py-2">
                                            <span className="mr-2">
                                                隱私設定
                                            </span>
                                            <Checkbox
                                                classNames={{
                                                    label: 'text-small',
                                                }}
                                                onChange={(e) =>
                                                    setMoviesComment(
                                                        'isPublic',
                                                        !e.target.checked
                                                    )
                                                }
                                            >
                                                不公開
                                            </Checkbox>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={onClose}
                                    onClick={handleSubmitComment}
                                >
                                    送出
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default RatingPanel

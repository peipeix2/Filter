import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
} from '@nextui-org/react'
import { db } from '../../../firebase'
import { setDoc, doc } from 'firebase/firestore'
import { BiSolidCameraMovie } from 'react-icons/bi'
import { Link } from 'react-router-dom'

interface ModalState {
  isOpen: boolean
  setModalIsOpen: (value: boolean) => void
  event: {
    title: string
    color: string
    id: string
    start: string
    poster: string
    backdrop: string
    originalTitle: string
    releaseDate: string
  }
  calendarState: any
  setCalendarState: any
  currentUserId: string
  userId: string
}

const CalendarModal = (Props: ModalState) => {
  const { onOpenChange } = useDisclosure()

  const handleOnClick = () => {
    Props.setModalIsOpen(!Props.isOpen)
  }

  const handleRemoveSchedule = (id: string) => {
    Props.setModalIsOpen(!Props.isOpen)
    updateScheduledTime(Props.event.id, Props.userId)
    const newExternalEvents = {
      movie_id: Props.event.id,
      movie_title: Props.event.title,
      movie_poster: Props.event.poster,
      movie_backdrop_path: Props.event.backdrop,
      movie_original_title: Props.event.originalTitle,
      created_at: 'any',
      schedule_time: 'unscheduled',
      movie_release: Props.event.releaseDate,
      user: Props.userId,
    }
    Props.setCalendarState((calendarState: any) => {
      return {
        ...calendarState,
        externalEvents: calendarState.externalEvents.concat(newExternalEvents),
        calendarEvents: calendarState.calendarEvents.filter(
          (item: any) => item.id !== id
        ),
      }
    })
  }

  const updateScheduledTime = async (movieId: string, userId: string) => {
    const favoritesRef = doc(db, 'USERS', userId, 'FAVORITES', movieId)
    try {
      await setDoc(
        favoritesRef,
        {
          schedule_time: 'unscheduled',
        },
        { merge: true }
      )
    } catch (err) {
      console.error('Error', err)
    }
  }

  const formattedTime = (ISOtime: string) => {
    const date = new Date(Date.parse(ISOtime))
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Modal
      size="xs"
      isOpen={Props.isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
    >
      <ModalContent>
        <>
          <ModalHeader className="flex items-center gap-1 text-xs text-slate-400">
            <BiSolidCameraMovie />
            <span>觀影計畫</span>
          </ModalHeader>
          <ModalBody>
            <Link to={`/movies/${Props.event?.id}`}>
              <Image
                isBlurred
                isZoomed
                className="h-auto w-auto max-w-full"
                src={`https://image.tmdb.org/t/p/w500/${Props.event?.poster}`}
              />
            </Link>
            <div className="screening-title mb-4 flex flex-col items-center gap-2">
              <Link to={`/movies/${Props.event?.id}`}>
                <p className="text-xl font-bold text-[#89a9a6]">
                  {Props.event?.title || 'not shown yet'}
                </p>
              </Link>
              <p className="text-xs font-extrabold text-slate-400">
                {formattedTime(Props.event?.start) || 'not shown yet'}
              </p>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              size="sm"
              color="default"
              variant="light"
              onClick={handleOnClick}
              className="border-2 border-[#94a3ab] bg-white text-[#94a3ab]"
            >
              {Props.currentUserId === Props.userId ? '取消' : '關閉'}
            </Button>
            {Props.currentUserId === Props.userId && (
              <Button
                size="sm"
                color="danger"
                className="bg-[#f46854] text-white"
                onClick={() => handleRemoveSchedule(Props.event.id)}
              >
                刪除計畫
              </Button>
            )}
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  )
}

export default CalendarModal

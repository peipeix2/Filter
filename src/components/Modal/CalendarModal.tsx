import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react'
import { db } from '../../../firebase'
import { setDoc, doc } from 'firebase/firestore'

interface ModalState {
  isOpen: boolean
  setModalIsOpen: (value: boolean) => void
  event: {
    title: string
    color: string
    id: string
    start: string
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
    Props.setCalendarState((calendarState: any) => {
      return {
        ...calendarState,
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

  return (
    <Modal isOpen={Props.isOpen} onOpenChange={onOpenChange} hideCloseButton>
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Schedule Details
          </ModalHeader>
          <ModalBody>
            <p>{Props.event?.title || 'not shown yet'}</p>
            <p>{Props.event?.start || 'not shown yet'}</p>
          </ModalBody>

          <ModalFooter>
            <Button color="default" variant="light" onClick={handleOnClick}>
              {Props.currentUserId === Props.userId ? '取消' : '關閉'}
            </Button>
            {Props.currentUserId === Props.userId && (
              <Button
                color="danger"
                onClick={() => handleRemoveSchedule(Props.event.id)}
              >
                刪除行程
              </Button>
            )}
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  )
}

export default CalendarModal

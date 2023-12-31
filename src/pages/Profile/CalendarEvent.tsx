import { Card, CardBody, Image } from '@nextui-org/react'
import { MdOutlineSchedule } from 'react-icons/md'
import { TiDelete } from 'react-icons/ti'
import { Link } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import { db } from '../../../firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { CalendarState } from '../../utils/type'

interface CalendarEventState {
  userId: string
  event: {
    id: string
    title: string
    color: string
    start: string
    end: string
    allDay: boolean
    poster: string
    backdrop: string
    originalTitle: string
    releaseDate: string
  }
  calendarState: CalendarState
  setCalendarState: React.Dispatch<React.SetStateAction<CalendarState>>
}

const CalendarEvent = (Props: CalendarEventState) => {
  const user = useUserStore((state) => state.user)
  const currentUserId = user.userId

  const formattedTime = (ISOtime: string) => {
    const date = new Date(Date.parse(ISOtime))
    return date.toLocaleDateString('zh-TW')
  }

  const handleDeleteFavorite = async (
    movieId: string,
    userId: string,
    movieTitle: string
  ) => {
    toast.success(`已將《${movieTitle}》從收藏中移除`)
    Props.setCalendarState((calendarState) => {
      return {
        ...calendarState,
        calendarEvents:
          calendarState.calendarEvents &&
          calendarState.calendarEvents.filter((item) => item.id !== movieId),
      }
    })
    const favoriteRef = doc(db, 'USERS', userId, 'FAVORITES', movieId)
    await deleteDoc(favoriteRef)
  }

  return (
    <Card
      className="calendar-event-card relative mb-1 mt-2 min-h-[180px] w-[120px] p-1 lg:mt-0 lg:min-h-[230px] lg:w-[144px]"
      style={{
        backgroundColor: '#f46854',
        borderColor: '#f46854',
        cursor: 'pointer',
      }}
    >
      {currentUserId === Props.userId && (
        <TiDelete
          className="absolute right-1 top-1 z-10 text-base lg:text-xl"
          onClick={() =>
            handleDeleteFavorite(
              Props.event.id,
              Props.userId,
              Props.event.title
            )
          }
        />
      )}
      <CardBody>
        <Link to={`/movies/${Props.event.id}`}>
          <div className="fc-event-main w-full">
            <div className="flex w-full flex-col items-center">
              <Image
                src={`https://image.tmdb.org/t/p/w500/${Props.event.poster}`}
                className="mb-2 h-auto max-h-[150px] w-auto max-w-[100px]"
              />
              <strong className="break-words text-center text-xs text-white lg:text-[13.6px]">
                {Props.event.title}
              </strong>
              <div className="flex items-center">
                <MdOutlineSchedule className="mr-1 text-xs text-slate-100" />
                <span className="text-xs text-slate-100">
                  {formattedTime(Props.event.start)}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </CardBody>
    </Card>
  )
}

export default CalendarEvent

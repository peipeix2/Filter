import { memo, useEffect, useRef } from 'react'
import { Draggable } from '@fullcalendar/interaction'
import { Card, CardBody, Image } from '@nextui-org/react'
import { TiDelete } from 'react-icons/ti'
import { Link } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import { db } from '../../../firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { FavoriteState, CalendarState } from '../../utils/type'

interface EventState {
  event: FavoriteState
  calendarState: CalendarState
  setCalendarState: React.Dispatch<React.SetStateAction<CalendarState>>
}

const ExternalEvent = memo((Props: EventState) => {
  let elRef = useRef<HTMLDivElement>(null)
  const user = useUserStore((state) => state.user)
  const currentUserId = user.userId

  useEffect(() => {
    let draggable: Draggable | null = null
    if (elRef.current) {
      draggable = new Draggable(elRef.current, {
        eventData: function () {
          return { ...Props.event, create: true }
        },
      })
    }

    return () => {
      if (draggable) draggable.destroy()
    }
  })

  const handleDeleteFavorite = async (
    movieId: string,
    userId: string,
    movieTitle: string
  ) => {
    toast.success(`已將《${movieTitle}》從收藏中移除`)
    Props.setCalendarState((calendarState) => {
      return {
        ...calendarState,
        externalEvents:
          calendarState.externalEvents &&
          calendarState.externalEvents.filter(
            (item) => item.movie_id !== movieId
          ),
      }
    })
    const favoriteRef = doc(db, 'USERS', userId, 'FAVORITES', movieId)
    await deleteDoc(favoriteRef)
  }

  return (
    <Card
      ref={elRef}
      className="fc-event relative z-0 mb-1 h-full min-h-[180px] w-[120px] p-1 lg:min-h-[230px] lg:w-auto lg:min-w-[144px]"
      title={Props.event.movie_title}
      data-id={Props.event.movie_id}
      data-color="#f46854"
      data-release={Props.event.movie_release}
      data-poster={Props.event.movie_poster}
      data-originalTitle={Props.event.movie_original_title}
      data-backdrop={Props.event.movie_backdrop_path}
      style={{
        backgroundColor: '#89a9a6',
        borderColor: '#89a9a6',
        cursor: 'pointer',
      }}
    >
      {currentUserId === Props.event.user && (
        <TiDelete
          className="absolute right-1 top-1 z-10 text-base lg:text-xl"
          onClick={() =>
            handleDeleteFavorite(
              Props.event.movie_id,
              Props.event.user,
              Props.event.movie_title
            )
          }
        />
      )}
      <CardBody className="h-full">
        <Link to={`/movies/${Props.event.movie_id}`}>
          <div className="fc-event-main flex h-full flex-col items-center justify-between">
            <Image
              src={`https://image.tmdb.org/t/p/w500/${Props.event.movie_poster}`}
              className="mb-2 h-auto max-h-[150px] w-auto max-w-[100px]"
            />
            <div className="flex flex-grow flex-col items-center justify-center">
              <strong className="mt-2 break-words text-white">
                {Props.event.movie_title}
              </strong>
            </div>
          </div>
        </Link>
      </CardBody>
    </Card>
  )
})

export default ExternalEvent

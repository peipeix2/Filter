import { memo, useEffect, useRef } from 'react'
import { Draggable } from '@fullcalendar/interaction'
import { Card, CardBody, Image } from '@nextui-org/react'
import { TiDelete } from 'react-icons/ti'
import { Link } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import { db } from '../../../firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import toast from 'react-hot-toast'

interface EventState {
  event: {
    movie_title: string
    // color: string
    movie_id: string
    movie_original_title: string
    schedule_time: string
    user: string
    movie_poster: string
    movie_backdrop_path: string
    movie_release: string
    created_at: Date
    release_date: string
  }
  calendarState: any
  setCalendarState: any
}

const ExternalEvent = memo((Props: EventState) => {
  let elRef = useRef<HTMLDivElement>(null)
  const user = useUserStore((state) => state.user)
  const currentUserId = user.userId

  useEffect(() => {
    let draggable: any
    if (elRef.current) {
      draggable = new Draggable(elRef.current, {
        eventData: function () {
          return { ...Props.event, create: true }
        },
      })
    }

    return () => draggable.destroy()
  })

  const handleDeleteFavorite = async (
    movieId: string,
    userId: string,
    movieTitle: string
  ) => {
    toast.success(`已將《${movieTitle}》從收藏中移除`)
    Props.setCalendarState((calendarState: any) => {
      return {
        ...calendarState,
        externalEvents: calendarState.externalEvents.filter(
          (item: any) => item.movie_id !== movieId
        ),
      }
    })
    const favoriteRef = doc(db, 'USERS', userId, 'FAVORITES', movieId)
    await deleteDoc(favoriteRef)
  }

  return (
    <Card
      ref={elRef}
      className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event relative z-0 mb-1 min-h-[230px] w-auto min-w-[144px] p-1"
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
          className="absolute right-1 top-1 z-10 text-xl"
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
          <div className="fc-event-main h-full">
            <div className="flex h-full flex-col items-center justify-between">
              {/* <span className="mb-2 text-xs">
              上映日期：{Props.event.movie_release}
            </span> */}
              <Image
                src={`https://image.tmdb.org/t/p/w500/${Props.event.movie_poster}`}
                className="mb-2 h-auto max-h-[150px] w-auto max-w-[100px]"
              />

              <strong className="mt-3 break-words">
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

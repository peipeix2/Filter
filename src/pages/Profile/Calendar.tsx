import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import ExternalEvent from './ExternalEvent'
import CalendarModal from '../../components/Modal/CalendarModal'
import { ScrollShadow } from '@nextui-org/react'
import { db } from '../../../firebase'
import { collection, getDocs, setDoc, doc } from 'firebase/firestore'
import { useParams } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import { Link } from 'react-router-dom'
import { Tabs, Tab } from '@nextui-org/react'
import CalendarEvent from './CalendarEvent'
import UnshceduledEmptyState from '../../components/EmptyStates/UnscheduledEmptyState'
import ScheduledEmptyState from '../../components/EmptyStates/ScheduledEmptyState'

interface CalendarEventState {
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

interface ExternalEventState {
  movie_id: string
  movie_title: string
  movie_poster: string
  movie_backdrop_path: string
  movie_original_title: string
  created_at: any
  schedule_time: string
  movie_release: string
  user: string
}

interface CalendarState {
  weekendsVisible: boolean
  externalEvents: ExternalEventState[]
  calendarEvents: CalendarEventState[]
}

const Calendar = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [activeSchedule, setActiveSchedule] = useState<string>('')
  const { user } = useUserStore()
  const [calendarState, setCalendarState] = useState<CalendarState>({
    weekendsVisible: true,
    externalEvents: [],
    calendarEvents: [],
  })
  const { userId } = useParams()

  useEffect(() => {
    const getUserFavorites = async () => {
      if (userId) {
        const userRef = collection(db, 'USERS', userId, 'FAVORITES')
        const querySnapshot = await getDocs(userRef)
        const favoritesList: any = []
        querySnapshot.forEach((doc) => {
          favoritesList.push(doc.data())
        })

        setCalendarState((calendarState) => {
          return {
            ...calendarState,
            calendarEvents: favoritesList
              .filter((item: any) => item.schedule_time !== 'unscheduled')
              .map((item: any) => {
                return {
                  title: item.movie_title,
                  color: '#f46854',
                  start: item.schedule_time,
                  id: item.movie_id,
                  end: item.schedule_time,
                  allDay: true,
                  poster: item.movie_poster,
                  backdrop: item.movie_backdrop_path,
                  originalTitle: item.movie_original_title,
                  releaseDate: item.movie_release,
                }
              }),
            externalEvents: favoritesList.filter(
              (item: any) => item.schedule_time === 'unscheduled'
            ),
          }
        })
      }
    }

    getUserFavorites()
  }, [])

  const handleEventReceive = (eventInfo: any) => {
    const currentUser = user.userId
    if (currentUser !== userId) {
      eventInfo.revert()
      return
    }

    let date = eventInfo.event.start
    const endDate = new Date(date)
    const releaseDate = new Date(
      eventInfo.draggedEl.getAttribute('data-release').replace('-', ',')
    )
    if (releaseDate > endDate) {
      alert('該影片尚未上映！')
      eventInfo.revert()
      return
    }

    endDate.setHours(date.getHours() + 2)
    const newEvent = {
      id: eventInfo.draggedEl.getAttribute('data-id'),
      title: eventInfo.draggedEl.getAttribute('title'),
      color: eventInfo.draggedEl.getAttribute('data-color'),
      start: date.toISOString(),
      end: endDate.toISOString(),
      allDay: true,
      poster: eventInfo.draggedEl.getAttribute('data-poster'),
      backdrop: eventInfo.draggedEl.getAttribute('data-backdrop'),
      originalTitle: eventInfo.draggedEl.getAttribute('data-originalTitle'),
      releaseDate: eventInfo.draggedEl.getAttribute('data-release'),
      // end: eventInfo.event.start.toISOString(),
      // custom: eventInfo.draggedEl.getAttribute('data-custom'),
    }

    console.log(newEvent)
    updateScheduledTime(newEvent.id, userId, newEvent.start)

    setCalendarState((calendarState) => {
      return {
        ...calendarState,
        externalEvents: calendarState.externalEvents.filter(
          (movie) => movie.movie_id !== newEvent.id
        ),
        calendarEvents: calendarState.calendarEvents.concat(newEvent),
      }
    })
  }

  const updateScheduledTime = async (
    movieId: string,
    userId: string,
    scheduledTime: string
  ) => {
    const favoritesRef = doc(db, 'USERS', userId, 'FAVORITES', movieId)
    try {
      await setDoc(
        favoritesRef,
        {
          schedule_time: scheduledTime,
        },
        { merge: true }
      )
    } catch (err) {
      console.error('Error', err)
    }
  }

  function myDropEvent(info: any) {
    // console.log(info.oldEvent)
    // const today = Date.now()
    // const oldScheduleDate = info.oldEvent._instance.range.start
    // console.log(oldScheduleDate)
    // if (oldScheduleDate < today) {
    //   return info.revert()
    // }
    const currentUser = user.userId
    if (currentUser !== userId) {
      info.revert()
      return
    }

    const movieId = info.oldEvent._def.publicId
    const newScheduledTime = info.event.start.toISOString()
    console.log(newScheduledTime)

    updateScheduledTime(movieId, userId, newScheduledTime)
    const changedEventIndex = calendarState.calendarEvents.findIndex(
      (element) => element.id === movieId
    )
    setCalendarState((calendarState) => {
      const updatedEvents = [...calendarState.calendarEvents]
      updatedEvents[changedEventIndex] = {
        ...updatedEvents[changedEventIndex],
        start: newScheduledTime,
        end: newScheduledTime,
      }
      return {
        ...calendarState,
        calendarEvents: updatedEvents,
      }
    })

    // alert(
    //   info.event.title + ' was dropped on ' + info.event.start.toISOString()
    // )

    // if (!confirm('Are you sure about this change?')) {
    //   info.revert()
    // }
  }

  const handleEventClick = (info: any) => {
    setModalIsOpen(!modalIsOpen)
    setActiveSchedule(info.event._def.publicId)
    // eventClick.event.remove()
  }

  if (!userId) return

  return (
    <>
      <Tabs
        aria-label="Options"
        radius="full"
        variant="underlined"
        fullWidth={true}
      >
        <Tab key="unscheduled" title="未排期收藏">
          <ScrollShadow
            orientation="horizontal"
            className="mb-20"
            hideScrollBar
          >
            <div id="external-events" className="flex gap-2">
              {calendarState.externalEvents.length === 0 ? (
                <UnshceduledEmptyState />
              ) : (
                calendarState.externalEvents.map((event: any) => (
                  <ExternalEvent
                    key={event.movie_id}
                    event={event}
                    calendarState={calendarState}
                    setCalendarState={setCalendarState}
                  />
                ))
              )}
            </div>
          </ScrollShadow>
        </Tab>
        <Tab key="scheduled" title="已排期收藏">
          <ScrollShadow
            orientation="horizontal"
            className="mb-20"
            hideScrollBar
          >
            <div id="calendar-events" className="flex gap-2">
              {calendarState.calendarEvents.length === 0 ? (
                <ScheduledEmptyState />
              ) : (
                calendarState.calendarEvents.map((event: any) => (
                  <CalendarEvent
                    key={event.id}
                    event={event}
                    userId={userId}
                    calendarState={calendarState}
                    setCalendarState={setCalendarState}
                  />
                ))
              )}
            </div>
          </ScrollShadow>
        </Tab>
      </Tabs>
      <FullCalendar
        plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,listYear',
        }}
        editable={true}
        droppable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        initialView="dayGridMonth"
        displayEventEnd={true}
        events={calendarState.calendarEvents}
        eventDrop={myDropEvent}
        eventReceive={handleEventReceive}
        eventClick={handleEventClick}
      />
      <CalendarModal
        isOpen={modalIsOpen}
        setModalIsOpen={(value) => setModalIsOpen(value)}
        event={
          calendarState.calendarEvents.filter(
            (item) => item.id === String(activeSchedule)
          )[0]
        }
        calendarState={calendarState}
        setCalendarState={setCalendarState}
        currentUserId={user.userId}
        userId={userId}
      />
    </>
  )
}

export default Calendar

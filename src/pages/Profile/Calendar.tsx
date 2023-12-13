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

const Calendar = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [activeSchedule, setActiveSchedule] = useState<string>('')
  const { user } = useUserStore()
  const [calendarState, setCalendarState] = useState({
    weekendsVisible: true,
    // externalEvents: [
    //   { title: 'Art 1', color: '#0097a7', id: 34432, duration: '03:00' },
    //   { title: 'Art 2', color: '#f44336', id: 323232, duration: '03:00' },
    //   { title: 'Art 3', color: '#f57f17', id: 1111, duration: '03:00' },
    //   { title: 'Art 4', color: '#90a4ae', id: 432432, duration: '03:00' },
    // ],
    // externalEvents: DUMMY_DATA,
    externalEvents: [],
    calendarEvents: [
      {
        title: 'Event1',
        color: '#0097a7',
        id: '123',
        start: '2023-12-13T16:00:00.000Z',
      },
      {
        title: 'Event2',
        color: '$90a4ae',
        id: '1234',
        start: '2023-12-08T12:30:00',
      },
      {
        title: '旺卡',
        color: '#89a9a6',
        start: '2023-12-13T16:00:00.000Z',
        id: '787699',
        end: '2023-12-13T16:00:00.000Z',
        allDay: true,
      },
    ],
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
                  color: '#89a9a6',
                  start: item.schedule_time,
                  id: item.movie_id,
                  end: item.schedule_time,
                  allDay: true,
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
      // end: eventInfo.event.start.toISOString(),
      // custom: eventInfo.draggedEl.getAttribute('data-custom'),
    }

    console.log(newEvent)
    updateScheduledTime(newEvent.id, userId, newEvent.start)

    setCalendarState((calendarState) => {
      return {
        ...calendarState,
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

    alert(
      info.event.title + ' was dropped on ' + info.event.start.toISOString()
    )

    if (!confirm('Are you sure about this change?')) {
      info.revert()
    }
  }

  const handleEventClick = (info: any) => {
    setModalIsOpen(!modalIsOpen)
    setActiveSchedule(info.event._def.publicId)
    // eventClick.event.remove()
  }

  if (!userId) return

  return (
    <>
      <ScrollShadow orientation="horizontal" className="mb-20" hideScrollBar>
        <div id="external-events" className="flex gap-2">
          {calendarState.externalEvents.map((event: any) => (
            <ExternalEvent key={event.movie_id} event={event} />
          ))}
        </div>
      </ScrollShadow>
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

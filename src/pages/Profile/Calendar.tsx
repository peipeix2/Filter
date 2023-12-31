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
import { Tabs, Tab, Chip, Spinner } from '@nextui-org/react'
import CalendarEvent from './CalendarEvent'
import UnshceduledEmptyState from '../../components/EmptyStates/UnscheduledEmptyState'
import ScheduledEmptyState from '../../components/EmptyStates/ScheduledEmptyState'
import { motion, AnimatePresence } from 'framer-motion'
import { FavoriteState, CalendarState } from '../../utils/type'
import {
  EventDropArg,
  EventInput,
  EventClickArg,
} from '@fullcalendar/core/index.js'

const Calendar = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [activeSchedule, setActiveSchedule] = useState<string>('')
  const { user } = useUserStore()
  const [calendarState, setCalendarState] = useState<CalendarState>({
    weekendsVisible: true,
    externalEvents: null,
    calendarEvents: null,
  })
  const { userId } = useParams()

  useEffect(() => {
    const getUserFavorites = async () => {
      if (userId) {
        const userRef = collection(db, 'USERS', userId, 'FAVORITES')
        const querySnapshot = await getDocs(userRef)
        const favoritesList: FavoriteState[] = []
        querySnapshot.forEach((doc) => {
          favoritesList.push(doc.data() as FavoriteState)
        })

        setCalendarState((calendarState) => {
          return {
            ...calendarState,
            calendarEvents: favoritesList
              .filter((item) => item.schedule_time !== 'unscheduled')
              .map((item) => {
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
              (item) => item.schedule_time === 'unscheduled'
            ),
          }
        })
      }
    }

    getUserFavorites()
  }, [])

  const handleEventReceive = (eventInfo: EventInput) => {
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
    }

    updateScheduledTime(newEvent.id, userId, newEvent.start)

    setCalendarState((calendarState) => {
      if (
        calendarState &&
        calendarState.externalEvents &&
        calendarState.calendarEvents
      ) {
        return {
          ...calendarState,
          externalEvents: calendarState.externalEvents.filter(
            (movie) => movie.movie_id !== newEvent.id
          ),
          calendarEvents: calendarState.calendarEvents.concat(newEvent),
        }
      } else {
        return calendarState
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

  function myDropEvent(info: EventDropArg) {
    const currentUser = user.userId
    if (currentUser !== userId) {
      info.revert()
      return
    }

    const movieId = info.oldEvent._def.publicId
    const newScheduledTime = info.event.start?.toISOString()
    if (!newScheduledTime) return
    updateScheduledTime(movieId, userId, newScheduledTime)
    if (calendarState.calendarEvents) {
      const changedEventIndex = calendarState.calendarEvents.findIndex(
        (element) => element.id === movieId
      )

      setCalendarState((calendarState) => {
        if (calendarState && calendarState.calendarEvents) {
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
        } else {
          return calendarState
        }
      })
    }
  }

  const handleEventClick = (info: EventClickArg) => {
    setModalIsOpen(!modalIsOpen)
    setActiveSchedule(info.event._def.publicId)
  }

  if (!userId) return
  if (!calendarState.externalEvents || !calendarState.calendarEvents)
    return <Spinner className="my-5 h-40 w-full" color="default" />

  return (
    <>
      <Tabs
        aria-label="Options"
        radius="full"
        variant="underlined"
        fullWidth={true}
        classNames={{
          tabList: 'gap-6 w-full relative rounded-none p-0 border-divider',
          cursor: 'w-full bg-[#8acfc8]',
          tab: 'max-w-fit px-3 h-12',
          tabContent: 'group-data-[selected=true]:text-[#8acfc8]',
        }}
      >
        <Tab
          key="unscheduled"
          title={
            <div className="mb-2 flex items-center gap-2">
              <span className="font-semibold">未排期收藏</span>
              <Chip
                size="sm"
                variant="faded"
                classNames={{
                  base: 'bg-[#89a9a6]/50 border-none',
                  content: 'drop-shadow shadow-black text-white',
                }}
              >
                {calendarState.externalEvents.length}
              </Chip>
            </div>
          }
        >
          <ScrollShadow
            orientation="horizontal"
            className="mb-20"
            hideScrollBar
          >
            <div id="external-events" className="flex gap-2">
              {calendarState.externalEvents.length === 0 ? (
                <UnshceduledEmptyState />
              ) : (
                <AnimatePresence mode="popLayout">
                  {calendarState.externalEvents.map((event) => (
                    <motion.div
                      key={event.movie_id}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring' }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <ExternalEvent
                        event={event}
                        calendarState={calendarState}
                        setCalendarState={setCalendarState}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </ScrollShadow>
        </Tab>
        <Tab
          key="scheduled"
          title={
            <div className="mb-2 flex items-center gap-2">
              <span className="font-semibold">已排期收藏</span>
              <Chip
                size="sm"
                variant="faded"
                classNames={{
                  base: 'bg-[#89a9a6]/50 border-none',
                  content: 'drop-shadow shadow-black text-white',
                }}
              >
                {calendarState.calendarEvents.length}
              </Chip>
            </div>
          }
        >
          <ScrollShadow
            orientation="horizontal"
            className="mb-20"
            hideScrollBar
          >
            <div id="calendar-events" className="flex gap-2">
              {calendarState.calendarEvents.length === 0 ? (
                <ScheduledEmptyState />
              ) : (
                <AnimatePresence mode="popLayout">
                  {calendarState.calendarEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring' }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <CalendarEvent
                        key={event.id}
                        event={event}
                        userId={userId}
                        calendarState={calendarState}
                        setCalendarState={setCalendarState}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </ScrollShadow>
        </Tab>
      </Tabs>
      <div className="hidden lg:block">
        <FullCalendar
          plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next,today',
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
      </div>
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

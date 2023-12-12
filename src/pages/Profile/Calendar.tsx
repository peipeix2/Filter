import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import ExternalEvent from './ExternalEvent'
import CalendarModal from '../../components/Modal/CalendarModal'
import { ScrollShadow } from '@nextui-org/react'
import { db } from '../../../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useParams } from 'react-router-dom'

const DUMMY_DATA = [
  {
    color: '#89a9a6',
    adult: false,
    backdrop_path: null,
    genre_ids: [18],
    id: 1027501,
    original_language: 'zh',
    original_title: '不老騎士',
    overview:
      '一票『三高』老人熱血踏上機車環島之旅！每個人的想藉由這趟晚年出征，在人生的倒數時刻多贏回點什麼！',
    popularity: 0.6,
    poster_path: null,
    release_date: '2025-01-25',
    title: '不老騎士',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    color: '#89a9a6',
    adult: false,
    backdrop_path: '/iOACR0rQdakdf4txH4M22n4BwcG.jpg',
    genre_ids: [99],
    id: 916437,
    original_language: 'sv',
    original_title: 'Nelly och Nadine',
    overview: '',
    popularity: 2.597,
    poster_path: '/3AufhG0Lej87784i3m1w97jnGCl.jpg',
    release_date: '2022-10-14',
    title: 'Nelly och Nadine',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    color: '#89a9a6',
    adult: false,
    backdrop_path: '/uUmAJvh63WNjnenzetYbsCLwHiN.jpg',
    genre_ids: [18],
    id: 1044741,
    original_language: 'fr',
    original_title: 'Hors-saison',
    overview:
      '他現居巴黎，是知名的電影演員；她住在法國西海岸的度假小鎮，以教授鋼琴維生。十五年前，他們曾經相愛，終究還是分開。時間撫平了一切，他們在屬於各自的世界裡安好。然而，當他因為心理因素臨陣脫逃劇場演出，來到度假小鎮附近的療養中心休養時，兩人又意外重逢。舊情翻騰，回憶湧現，當年未竟的愛，這一次將如何在彼此的生命中交會？',
    popularity: 2.278,
    poster_path: '/7RU8qQksJ85orlNrvgiibgoEVx.jpg',
    release_date: '2023-11-16',
    title: '愛情過季',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    color: '#89a9a6',
    adult: false,
    backdrop_path: '/yPGRx9VrA98UlS5QfXrNws34D82.jpg',
    genre_ids: [10749],
    id: 1188258,
    original_language: 'ja',
    original_title: '青春18x2 #君へと続く道',
    overview:
      '18年前的台灣――高中生 Jimmy 打工的地方出現了一位大他四歲、從日本來的背包客女孩Ami。兩人整個夏天都在同一家店打工，漸漸地 Jimmy 對 Ami 萌生純純的愛意。他們共乘機車夜遊、看電影，就在距離越來越近的時候，Ami突然要回日本。看著難以接受的 Jimmy，Ami 提出了「某個約定」。  ​  時光飛逝，Jimmy 因故回到久未進門的老家，他在房間內找到18年前Ami從日本寄來的明信片。初戀的記憶湧上心頭， Jimmy 決定要好好面對過去、審視現在的自己，因此展開第一次在日本的單人旅行。Jimmy 聽著和 Ami 有共通回憶的歌曲，坐火車前往她的故鄉。究竟 Jimmy 和 Ami 能夠再次相遇嗎？',
    popularity: 3.067,
    poster_path: '/ahizMYnfk1vqcYnasf6NpLn0y83.jpg',
    release_date: '2024-03-14',
    title: '青春18x2 通往有你的旅程',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    color: '#89a9a6',
    adult: false,
    backdrop_path: null,
    genre_ids: [],
    id: 1008742,
    original_language: 'zh',
    original_title: '小子',
    overview:
      '沈迷於AR電玩「小子」的張融（陳昊森飾），他在電玩世界風光登頂，現實生活卻一塌糊塗，女友芽芽（李霈瑜飾）因而氣跑，又有黑道兄弟追著債要錢。最後竟兩位身分不明的萌娃（吳宗修、釋小願飾）突然走進他的世界。',
    popularity: 1.051,
    poster_path: '/m0RdgOBAVxvxgk3DX6SlrXE47GZ.jpg',
    release_date: '2024-02-08',
    title: '小子',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    color: '#89a9a6',
    adult: false,
    backdrop_path: '/mz1kAHVkFe6rX8U1ZOdh1zxfidA.jpg',
    genre_ids: [18],
    id: 1171558,
    original_language: 'ja',
    original_title: '熱のあとに',
    overview:
      '一名金髮男子倒臥在血泊裡，黑暗中，身上沾滿血漬的早苗悠悠走來，佇足在旁不動聲色地抽著菸；六年後，殺人未遂的早苗服滿刑期出獄，卻經常失神解離，無法忘懷失去的愛情。某日，在母親安排的一場相親，早苗結識了林業工人健太，健太隨和開朗，不介意她的過去。當兩人攜手走入婚姻，以為從此就能安穩度日，直到一位神祕女子的出現，讓早苗壓抑許久的內心再度產生漣漪⋯⋯。',
    popularity: 1.987,
    poster_path: '/2UiqJk3cxMqqQZBPmpB6vLOaHwI.jpg',
    release_date: '2023-11-14',
    title: '愛的狂熱',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
]

const Calendar = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [activeSchedule, setActiveSchedule] = useState<string>('')
  const [favorites, setFavorites] = useState<any>([])
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
        start: '2023-12-07',
      },
      {
        title: 'Event2',
        color: '$90a4ae',
        id: '1234',
        start: '2023-12-08T12:30:00',
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
        setFavorites(favoritesList)
        setCalendarState((calendarState) => {
          return {
            ...calendarState,
            externalEvents: favoritesList,
          }
        })
      }
    }

    getUserFavorites()
  }, [])

  const handleEventReceive = (eventInfo: any) => {
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

    setCalendarState((calendarState) => {
      return {
        ...calendarState,
        calendarEvents: calendarState.calendarEvents.concat(newEvent),
      }
    })
  }

  function myDropEvent(info: any) {
    // console.log(info.oldEvent)
    // const today = Date.now()
    // const oldScheduleDate = info.oldEvent._instance.range.start
    // console.log(oldScheduleDate)
    // if (oldScheduleDate < today) {
    //   return info.revert()
    // }

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
      />
    </>
  )
}

export default Calendar

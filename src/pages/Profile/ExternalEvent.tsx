import { memo, useEffect, useRef } from 'react'
import { Draggable } from '@fullcalendar/interaction'
import { Card, CardBody, Image } from '@nextui-org/react'

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
}

const ExternalEvent = memo((Props: EventState) => {
  let elRef = useRef<HTMLDivElement>(null)

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

  return (
    <Card
      ref={elRef}
      className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event mb-1 p-2"
      title={Props.event.movie_title}
      data-id={Props.event.movie_id}
      data-color="#89a9a6"
      data-release={Props.event.movie_release}
      style={{
        backgroundColor: '#89a9a6',
        borderColor: '#89a9a6',
        cursor: 'pointer',
      }}
    >
      <CardBody>
        <div className="fc-event-main">
          <div className="flex flex-col items-center">
            <span className="mb-2 text-xs">
              上映日期：{Props.event.movie_release}
            </span>
            <Image
              src={`https://image.tmdb.org/t/p/w500/${Props.event.movie_poster}`}
              className="h-auto max-h-[200px] w-auto max-w-[150px]"
            />
            <strong>{Props.event.movie_title}</strong>
          </div>
        </div>
      </CardBody>
    </Card>
  )
})

export default ExternalEvent

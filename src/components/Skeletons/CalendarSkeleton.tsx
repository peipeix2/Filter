import { Skeleton, Card, CardBody, Image } from '@nextui-org/react'

const CalendarSkeleton = () => {
  return (
    <Skeleton>
      <Card className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event relative z-0 mb-1 min-h-[230px] w-auto min-w-[144px] p-1">
        <Skeleton>
          <CardBody>
            <div className="fc-event-main">
              <div className="flex flex-col items-center">
                <Skeleton>
                  <Image className="mb-2 h-auto max-h-[150px] w-auto max-w-[100px]" />
                </Skeleton>
                <Skeleton>
                  <strong className="break-words">Skeleton</strong>
                </Skeleton>
              </div>
            </div>
          </CardBody>
        </Skeleton>
      </Card>
    </Skeleton>
  )
}

export default CalendarSkeleton

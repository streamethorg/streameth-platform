'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const CounterBox = ({
  number,
  lable,
}: {
  number: number
  lable: string
}) => {
  return (
    <div className="flex flex-col justify-between items-center p-1 text-black bg-white bg-opacity-70 rounded-lg md:p-2">
      <div className="text-sm font-black md:text-4xl">{number}</div>
      <div className="text-xs md:text-xl">{lable}</div>
    </div>
  )
}

const Counter = ({
  timeToStart,
}: {
  timeToStart: number // time in milliseconds
}) => {
  const router = useRouter()
  const [time, setTime] = useState(timeToStart / 1000)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time - 1)
    }, 1000)

    if (time < 0) {
      router.refresh()
    }

    return () => clearInterval(interval)
  }, [time])

  return (
    <div className="flex flex-col justify-between items-center m-2 md:p-0 md:m-4 backdrop-blur-sm backdrop-brightness-50 md:backdrop-brightness-100">
      <div className="flex flex-col justify-center items-center w-full rounded-xl md:p-4 md:bg-black">
        <p className="text-center text-white uppercase md:text-lg text-md">
          Stream will start in
        </p>
        <div className="flex flex-wrap justify-center items-center m-2 space-x-2 md:space-y-0">
          <CounterBox
            lable="days"
            number={Math.floor(time / 86400)}
          />
          <span className="text-lg text-white md:text-4xl">:</span>
          <CounterBox
            lable="hours"
            number={Math.floor((time % 86400) / 3600)}
          />
          <span className="text-lg text-white md:text-4xl">:</span>
          <CounterBox
            lable="minutes"
            number={Math.floor((time % 3600) / 60)}
          />
          <span className="text-lg text-white md:text-4xl">:</span>
          <CounterBox
            lable="seconds"
            number={Math.floor(time % 60)}
          />
        </div>
      </div>
    </div>
  )
}

export default Counter

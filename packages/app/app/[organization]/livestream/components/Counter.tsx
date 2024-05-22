'use client'

import { useEffect, useState } from 'react'

const CounterBox = ({
  number,
  lable,
}: {
  number: number
  lable: string
}) => {
  return (
    <div className="flex flex-col justify-between items-center p-2 text-black bg-white bg-opacity-70 rounded-lg">
      <div className="text-xl font-black md:text-6xl">{number}</div>
      <div className="text-sm md:text-xl">{lable}</div>
    </div>
  )
}

const Counter = ({
  timeToStart,
}: {
  timeToStart: number // time in milliseconds
}) => {
  const [time, setTime] = useState(timeToStart / 1000)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [time])

  return (
    <div className="flex z-10 flex-col justify-between items-center md:p-0">
      <div className="flex flex-col justify-center items-center w-full rounded-xl md:bg-black backdrop-blur-sm backdrop-brightness-50 aspect-video md:backdrop-brightness-100">
        <p className="text-xl text-center text-white uppercase md:text-2xl">
          Stream will start in
        </p>
        <div className="flex flex-wrap justify-center items-center m-4 space-x-2 md:m-8 md:space-y-0">
          <CounterBox
            lable="days"
            number={Math.floor(time / 86400)}
          />
          <span className="text-2xl text-white md:text-4xl">:</span>
          <CounterBox
            lable="hours"
            number={Math.floor((time % 86400) / 3600)}
          />
          <span className="text-2xl text-white md:text-4xl">:</span>
          <CounterBox
            lable="minutes"
            number={Math.floor((time % 3600) / 60)}
          />
          <span className="text-2xl text-white md:text-4xl">:</span>
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

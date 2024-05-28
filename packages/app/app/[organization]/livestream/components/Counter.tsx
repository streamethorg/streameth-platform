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
    <div className="flex flex-col justify-between items-center p-1 md:p-2 text-black bg-white bg-opacity-70 rounded-lg">
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
  const [time, setTime] = useState(timeToStart / 1000)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [time])

  return (
    <div className="m-2 md:m-4 flex flex-col justify-between items-center md:p-0 backdrop-blur-sm backdrop-brightness-50 md:backdrop-brightness-100">
      <div className="md:p-4 flex flex-col justify-center items-center w-full rounded-xl md:bg-black ">
        <p className="text-md text-center text-white uppercase md:text-lg">
          Stream will start in
        </p>
        <div className="flex flex-wrap justify-center items-center m-2 space-x-2  md:space-y-0">
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

'use client'
import SignUp from '@/components/plugins/SignUp'
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
      <div className="md:text-xl text">{lable}</div>
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
      <div className="relative z-10 flex flex-col justify-center items-center w-full bg-black bg-opacity-70 md:rounded-xl aspect-video">
        <p className="text-2xl text-white uppercase">
          Stream will start in
        </p>
        <div className="flex flex-row justify-center items-center m-8 space-x-2">
          <CounterBox
            lable="days"
            number={Math.floor(time / 86400)}
          />
          <span className="text-4xl text-white">:</span>
          <CounterBox
            lable="hours"
            number={Math.floor((time % 86400) / 3600)}
          />
          <span className="text-4xl text-white">:</span>
          <CounterBox
            lable="minutes"
            number={Math.floor((time % 3600) / 60)}
          />
          <span className="text-4xl text-white">:</span>
          <CounterBox
            lable="seconds"
            number={Math.floor(time % 60)}
          />
        </div>
        {/* <SignUp event={""} /> */}
      </div>
  )
}

export default Counter

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
    <div className="text-black flex flex-col justify-between items-center p-2 bg-opacity-70 bg-white rounded-lg">
      <div className="text-xl md:text-6xl font-black ">{number}</div>
      <div className=" text md:text-xl  ">{lable}</div>
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
    <div className="flex flex-row justify-between items-center md:p-4">
      <div className="aspect-video w-full bg-black md:rounded-xl flex flex-col items-center justify-center">
        <p className='text-white text-2xl uppercase'>Stream will start in</p>
        <div className="flex flex-row items-center justify-center space-x-2 m-8">
          <CounterBox
            lable="days"
            number={Math.floor(time / 86400)}
          />
          <span className=" text-4xl text-white">:</span>
          <CounterBox
            lable="hours"
            number={Math.floor((time % 86400) / 3600)}
          />
          <span className=" text-4xl text-white">:</span>
          <CounterBox
            lable="minutes"
            number={Math.floor((time % 3600) / 60)}
          />
          <span className=" text-4xl text-white">:</span>
          <CounterBox
            lable="seconds"
            number={Math.floor(time % 60)}
          />
        </div>
        {/* <SignUp event={""} /> */}
      </div>
    </div>
  )
}

export default Counter

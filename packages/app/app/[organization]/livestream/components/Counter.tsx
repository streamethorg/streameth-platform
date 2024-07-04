'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CounterBox = ({ number, lable }: { number: number; lable: string }) => {
  return (
    <div className="flex flex-col items-center justify-between rounded-lg bg-white bg-opacity-70 p-1 text-black md:p-2">
      <div className="text-sm font-black md:text-4xl">{number}</div>
      <div className="text-xs md:text-xl">{lable}</div>
    </div>
  );
};

const Counter = ({
  timeToStart,
}: {
  timeToStart: number; // time in milliseconds
}) => {
  const router = useRouter();
  const [time, setTime] = useState(timeToStart / 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time - 1);
    }, 1000);

    if (time < 0) {
      router.refresh();
    }

    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className="m-2 flex flex-col items-center justify-between backdrop-blur-sm backdrop-brightness-50 md:m-4 md:p-0 md:backdrop-brightness-100">
      <div className="flex w-full flex-col items-center justify-center rounded-xl md:bg-black md:p-4">
        <p className="text-md text-center uppercase text-white md:text-lg">
          Stream will start in
        </p>
        <div className="m-2 flex flex-wrap items-center justify-center space-x-2 md:space-y-0">
          <CounterBox lable="days" number={Math.floor(time / 86400)} />
          <span className="text-lg text-white md:text-4xl">:</span>
          <CounterBox
            lable="hours"
            number={Math.floor((time % 86400) / 3600)}
          />
          <span className="text-lg text-white md:text-4xl">:</span>
          <CounterBox lable="minutes" number={Math.floor((time % 3600) / 60)} />
          <span className="text-lg text-white md:text-4xl">:</span>
          <CounterBox lable="seconds" number={Math.floor(time % 60)} />
        </div>
      </div>
    </div>
  );
};

export default Counter;

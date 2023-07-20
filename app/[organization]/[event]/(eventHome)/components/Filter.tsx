"use client";
import { useContext, useEffect, useState, useLayoutEffect } from "react";
import { IEvent } from "@/server/model/event";
import Session from "@/server/model/session";
import {
  FilterContext,
  FilterOption,
} from "../../archive/components/FilterContext";
import { MobileContext } from "@/components/context/MobileContext";



const Filter = ({ event }: { event: IEvent }) => {
  const { setFilterOptions } = useContext(FilterContext);
  const {isLoading, isMobile} = useContext(MobileContext)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const days = event.end.getDate() - event.start.getDate() + 1;
  const dates: FilterOption<Session>[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(
      event.start.getTime() + i * 24 * 60 * 60 * 1000
    ).toDateString();
    dates.push({
      name: "date",
      value: date,
      type: "date",
      filterFunc: async (item: Session) => {
        return item.start.toDateString() === date;
      },
    });
  }

  useEffect(() => {
    setFilterOptions([dates[selectedIndex]]);
  }, [selectedIndex]);

  if(isLoading) {
    return <>loading</>
  }

  return (
    <div className="flex flex-row space-x-3 justify-center p-2 md:p-4 box-border">
      {isMobile ? (
        <select
          className="text-xl cursor-pointer font-bold"
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
        >
          {dates.map((date, index) => (
            <option key={date.value} value={index}>
              {date.value}
            </option>
          ))}
        </select>
      ) : (
        dates.map((date, index) => (
          <h1
            key={date.value}
            className={`text-2xl cursor-pointer font-bold ${
              selectedIndex === index ? "text-main-text" : "text-secondary-text"
            }`}
            onClick={() => {
              setSelectedIndex(index);
            }}
          >
            {date.value}
          </h1>
        ))
      )}
    </div>
  );
};

export default Filter;

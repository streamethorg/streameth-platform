"use client";
import { useState, useLayoutEffect, useContext } from "react";
import { IStage } from "@/server/model/stage";
import { CELL_HEIGHT } from "../utils";
import ScheduleGrid from "./ScheduleGrid";
import SessionsOnGrid from "./SessionsOnGrid";
import { IEvent } from "@/server/model/event";
import DateFilter from "./Filter";
import { MobileContext } from "@/components/context/MobileContext";
const SchedulePage = ({
  stages,
  event,
}: {
  stages: IStage[];
  event: IEvent;
}) => {
  const [selectedStage, setSelectedStage] = useState(stages[0].id);
  const {isMobile, isLoading} = useContext(MobileContext)

  if (isLoading) {
    return <>loading</>
  }

  return (
    <>
      <div className="flex flex-row flex-wrap md:flex-col bg-base justify-center">
        <DateFilter event={event} />
        {isMobile ? (
          <div className="flex flex-row justify-center items-center p-2 ">
            <select
              className="text-xl cursor-pointer font-bold box-border"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              {stages.map((stage) => (
                <option key={stage.name} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="w-[calc(100%-6rem)] flex flex-row ml-auto">
            {stages.map((stage) => (
              <div
                className="w-full p-4 text-center text-xl font-bold text-accent uppercase"
                key={stage.id}
              >
                {stage.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className={`flex flex-row w-full h-full relative overflow-y-scroll mb-[${
          CELL_HEIGHT + "rem"
        }]`}
      >
        <ScheduleGrid />
        <div className="w-[calc(100%-5rem)] flex flex-row h-full ml-auto">
          {isMobile ? (
            <SessionsOnGrid stageId={selectedStage} />
          ) : (
            stages.map((stage) => (
              <SessionsOnGrid key={stage.id} stageId={stage.id} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default SchedulePage;

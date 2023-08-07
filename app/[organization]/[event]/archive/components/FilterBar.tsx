"use client";
import { useState } from "react";
import SearchFilter from "./SearchFilter";
import SelectFilter from "./SelectFilter";
import { ISession } from "@/server/model/session";
import { ISpeaker } from "@/server/model/speaker";
import { IStage } from "@/server/model/stage";
import ComponentCard from "@/components/misc/ComponentCard";

export default function FilterBar({
  sessions,
  speakers,
  stages,
}: {
  sessions: ISession[];
  speakers: ISpeaker[];
  stages: IStage[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const speakerFilters = speakers.map((speaker) => {
    return {
      name: speaker.name,
      value: speaker.id,
      type: "speaker",
      filterFunc: async (item: ISession) => {
        return item.speakers.some((sessionSpeaker) => {
          return sessionSpeaker.id === speaker.id;
        });
      },
    };
  });

  const sessionFilters = sessions.map((session) => {
    return {
      name: session.name,
      value: session.name,
      type: "name",
      filterFunc: async (item: ISession) => {
        return item.name === session.name;
      },
    };
  });

  const sessionDateFilters = () => {
    const uniqueDates = Array.from(
      new Set(sessions.map((session) => session.start.toDateString()))
    );

    uniqueDates.sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    return uniqueDates.map((date) => ({
      name: date,
      value: date,
      type: "date",
      filterFunc: async (item: ISession) => {
        return item.start.toDateString() === date;
      },
    }));
  };

  const trackFilter = sessions.map((session) => {
    return {
      name: session.track,
      value: session.track,
      type: "track",
      filterFunc: async (item: ISession) => {
        return item.track === session.track;
      },
    };
  });

  const stageFilters = stages.map((stage) => {
    return {
      name: stage.name,
      value: stage.id,
      type: "stage",
      filterFunc: async (item: ISession) => {
        return item.stageId === stage.id;
      },
    };
  });

  return (
    <div className="drop-shadow-md md:drop-shadow-none md:shadow md:rounded-md bg-base">
      <div className="md:flex flex-col w-full relative px-4 py-2 md:p-4">
        <p className="text-lg font-bold mb-2 text-accent uppercase ">Search</p>
        <SearchFilter
          filterOptions={sessionFilters}
          filterName="session name"
        />
        <SearchFilter filterOptions={speakerFilters} filterName="speaker" />
        <div className="lg:hidden">
          <p
            className="text-lg mt-4 mb-2 font-bold text-accent uppercase "
            onClick={() => setIsOpen(!isOpen)}
          >
            More filters
          </p>
          {isOpen && (
            <>
              <SelectFilter filterOptions={stageFilters} filterName="Stage" />
              <SelectFilter
                filterOptions={sessionDateFilters()}
                filterName="Date"
              />
            </>
          )}
        </div>
        <div className="hidden lg:block">
          <p className="text-lg mt-4 mb-2 font-bold text-accent uppercase ">
            More filters
          </p>
          <SelectFilter filterOptions={stageFilters} filterName="Stage" />
          <SelectFilter
            filterOptions={sessionDateFilters()}
            filterName="Date"
          />
          {/* <SelectFilter filterOptions={trackFilter} filterName="Track" /> */}
        </div>
      </div>
    </div>
  );
}

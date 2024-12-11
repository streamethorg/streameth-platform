import React from "react";
import { useTimeline } from "@/context/TimelineContext";
import { Button } from "../ui/button";
export default function AnimationSettings() {
    const { events, addEvent } = useTimeline();
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Animation Settings</h2>
            <Button
                className="padding bg-gray-200 p-4"
                onClick={() => {
                    addEvent({
                        id: "test",
                        label: "animation",
                        start: 0,
                        end: 10,
                        duration: 10,
                        type: "media",
                        url: "https://static.videezy.com/system/resources/previews/000/036/644/original/Fancy-1.mp4",
                    });
                }}
            >
                Anmation
            </Button>
        </div>
    );
}

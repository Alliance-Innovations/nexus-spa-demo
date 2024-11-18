"use client";

import { useEffect, useRef } from "react";
import { useEventStore } from "../store/events";

export function EventLog() {
  const { events, clearEvents} = useEventStore();

  const latestEventRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (latestEventRef.current) {
      latestEventRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events]);

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Event Log</h2>
        <button
          onClick={clearEvents}
          className="text-sm text-white bg-red-500 px-2 py-1 rounded-md hover:bg-red-600"
        >
          Clear
        </button>
      </div>
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {events.map((event, index) => (
          <div
            key={event.id}
            ref={index === events.length - 1 ? latestEventRef : undefined}
            className="bg-white p-3 rounded border border-gray-100 text-sm"
          >
            <div className="flex justify-between text-gray-600">
              <span>{event.type}</span>
              <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="text-gray-800 mt-1">
              {Object.entries(event.eventData).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {String(value)}
                </div>
              ))}
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No events recorded yet
          </p>
        )}
      </div>
    </div>
  );
}

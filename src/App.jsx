import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";

export default function StylishCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/events.json");
        const data = await response.json();
        setEventsData(data);
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };
    fetchEvents();
  }, []);

  const getCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const days = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const days = getCalendarDays();

  const eventsForMonth = eventsData.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    const formattedDate = format(eventDate, "yyyy-MM-dd");

    if (isSameMonth(eventDate, currentMonth)) {
      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push(event);
    }
    return acc;
  }, {});

  const today = new Date();

  return (
    <div className="p-4 sm:p-6 md:p-10 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Calendar</h1>
          <p className="text-sm text-gray-500">Full Event Schedule</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="bg-gray-100 p-1 rounded-lg flex space-x-2">
            {["Weekly", "Monthly", "Timeline"].map((view) => (
              <button
                key={view}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  view === "Monthly"
                    ? "bg-white shadow font-bold"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md">
            + Add Event
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="text-gray-600 hover:text-black text-xl"
        >
          &#8592;
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-gray-600 hover:text-black text-xl"
        >
          &#8594;
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-t border-b py-2 text-center font-medium text-xs sm:text-sm text-gray-500 bg-gray-50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={day}
            className={`py-1 ${
              format(today, "EEE") === day ? "text-blue-600 font-bold" : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div
        className="grid grid-cols-7 gap-1 sm:gap-2 text-center mt-2"
        style={{ minHeight: "60vh" }}
      >
        {days.map((day, idx) => {
          const isCurrent = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isSameDay(day, today);
          const dayEvents = eventsForMonth[format(day, "yyyy-MM-dd")] || [];

          return (
            <div
              key={idx}
              onClick={() => setSelectedDate(day)}
              className={`h-24 sm:h-28 md:h-32 overflow-hidden rounded-md p-1 sm:p-2 border relative cursor-pointer flex flex-col transition-all
                ${isCurrent ? "bg-white" : "bg-gray-50 text-gray-400"}
                ${isSelected ? "ring-2 ring-blue-500" : ""}
                ${isTodayDate ? "border-2 border-blue-500" : ""}
              `}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span>{format(day, "d")}</span>
                {isTodayDate && (
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-1 py-[1px] rounded-full">
                    Today
                  </span>
                )}
              </div>

              {/* Events rendered at bottom */}
              <div className="mt-auto space-y-0.5 text-[10px] sm:text-xs overflow-auto max-h-[72px]">
                {dayEvents.map((event, i) => (
                  <div
                    key={i}
                    className="p-0.5 rounded-md text-white"
                    style={{ backgroundColor: event.color || "#4f46e5" }}
                  >
                    <strong>{event.title}</strong>
                    <span className="block">
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

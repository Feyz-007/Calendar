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

  // Fetch events from static JSON file
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

  // Generate days for calendar grid (start of week to end of week)
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

  // Group events by date (YYYY-MM-DD) for current month
  const eventsForMonth = eventsData.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    const formattedDate = format(eventDate, "yyyy-MM-dd");

    if (isSameMonth(eventDate, currentMonth)) {
      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push(event);
    }
    return acc;
  }, {});

  return (
    <div className="p-10 pb-20 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
          <p className="text-gray-500">Full Event Schedule</p>
          <p className="text-sm text-gray-500">
            {format(new Date(), "d MMMM yyyy")}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Switch Buttons */}
          <div className="bg-gray-100 p-1 rounded-lg flex space-x-2">
            {["Weekly", "Monthly", "Timeline"].map((view) => (
              <button
                key={view}
                className={`px-4 py-2 text-sm rounded-md ${
                  view === "Monthly"
                    ? "bg-white shadow font-bold"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          {/* Add Event Button */}
          <button
            onClick={() => alert("Static events only. This button is for future use.")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            + Add Event
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="px-4 py-2 bg-white shadow-md border border-gray-200 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition duration-200"
          aria-label="Previous Month"
        >
          &#8592;
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="px-4 py-2 bg-white shadow-md border border-gray-200 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition duration-200"
          aria-label="Next Month"
        >
          &#8594;
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-t border-b text-center font-semibold bg-gray-50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => {
          const isToday = i === new Date().getDay();
          return (
            <div
              key={day}
              className={`py-3 ${
                isToday
                  ? "bg-blue-100 text-blue-600 rounded-lg"
                  : "text-gray-500"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Calendar Grid */}
      <div
        className="grid grid-cols-7 gap-2 text-center mt-2"
        style={{ height: "calc(100vh - 300px)" }}
      >
        {days.map((day, idx) => {
          const isCurrent = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isSameDay(day, new Date());
          const dayEvents = eventsForMonth[format(day, "yyyy-MM-dd")] || [];

          return (
            <div
              key={idx}
              onClick={() => setSelectedDate(day)}
              className={`h-32 overflow-y-auto rounded-lg p-2 border relative cursor-pointer flex flex-col transition-all
                ${isCurrent ? "bg-white" : "bg-gray-50 text-gray-400"}
                ${isSelected ? "ring-2 ring-blue-500" : ""}
                ${isTodayDate ? "border-2 border-blue-500" : ""}
              `}
            >
              {/* Date Header */}
              <div className="flex items-center justify-between text-sm font-bold">
                <span>{format(day, "d")}</span>
                {isTodayDate && (
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-[1px] rounded-full">
                    Today
                  </span>
                )}
              </div>

              {/* Event List */}
              <div className="mt-auto space-y-1 text-xs">
                {dayEvents.map((event, i) => (
                  <div
                    key={i}
                    className="p-1 rounded-md text-white"
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

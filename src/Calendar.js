import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, AlertCircle, CalendarDays, Sparkles } from 'lucide-react';

// Static events data
const EVENTS = [
  {
    id: 1,
    title: "Team Meeting",
    date: "2025-10-05",
    time: "10:00",
    duration: 60,
    color: "#3b82f6"
  },
  {
    id: 2,
    title: "Project Deadline",
    date: "2025-10-05",
    time: "10:30",
    duration: 30,
    color: "#ef4444"
  },
  {
    id: 3,
    title: "Design Review",
    date: "2025-10-10",
    time: "14:00",
    duration: 90,
    color: "#8b5cf6"
  },
  {
    id: 4,
    title: "Client Call",
    date: "2025-10-15",
    time: "11:00",
    duration: 45,
    color: "#10b981"
  },
  {
    id: 5,
    title: "Workshop",
    date: "2025-10-15",
    time: "11:30",
    duration: 120,
    color: "#f59e0b"
  },
  {
    id: 6,
    title: "Code Review",
    date: "2025-10-20",
    time: "15:00",
    duration: 60,
    color: "#06b6d4"
  },
  {
    id: 7,
    title: "Sprint Planning",
    date: "2025-10-25",
    time: "09:00",
    duration: 120,
    color: "#ec4899"
  },
  {
    id: 8,
    title: "Lunch Meeting",
    date: "2025-10-28",
    time: "12:00",
    duration: 60,
    color: "#14b8a6"
  }
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get calendar data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, daysInPrevMonth - i)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i)
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i)
      });
    }
    
    return days;
  }, [currentDate]);

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Format date for comparison
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = formatDate(date);
    return EVENTS.filter(event => event.date === dateStr);
  };

  // Detect time conflicts
  const hasTimeConflict = (events) => {
    if (events.length < 2) return false;
    
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const event1 = events[i];
        const event2 = events[j];
        
        const [h1, m1] = event1.time.split(':').map(Number);
        const [h2, m2] = event2.time.split(':').map(Number);
        
        const start1 = h1 * 60 + m1;
        const end1 = start1 + event1.duration;
        const start2 = h2 * 60 + m2;
        const end2 = start2 + event2.duration;
        
        if ((start1 < end2 && end1 > start2)) {
          return true;
        }
      }
    }
    return false;
  };

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const hasConflict = hasTimeConflict(selectedEvents);

  // Count total events in current month
  const monthEvents = useMemo(() => {
    return EVENTS.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    }).length;
  }, [currentDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 mb-6 border border-white/40">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl">
                  <CalendarDays className="text-white" size={32} />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Sparkles size={14} className="text-purple-500" />
                  <p className="text-slate-600 text-sm font-medium">{monthEvents} events this month</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={goToToday}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Today
              </button>
              <button
                onClick={goToPreviousMonth}
                className="p-3 bg-white hover:bg-slate-50 rounded-xl transition-all transform hover:scale-105 shadow-lg border border-slate-200"
              >
                <ChevronLeft size={24} className="text-slate-700" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-3 bg-white hover:bg-slate-50 rounded-xl transition-all transform hover:scale-105 shadow-lg border border-slate-200"
              >
                <ChevronRight size={24} className="text-slate-700" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/40">
              {/* Day names */}
              <div className="grid grid-cols-7 gap-3 mb-6">
                {dayNames.map(day => (
                  <div key={day} className="text-center font-bold text-slate-700 py-3 text-sm uppercase tracking-wide">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-3">
                {calendarData.map((day, index) => {
                  const dayEvents = getEventsForDate(day.fullDate);
                  const hasEvents = dayEvents.length > 0;
                  const conflict = hasTimeConflict(dayEvents);
                  const today = isToday(day.fullDate);
                  const selected = selectedDate && formatDate(selectedDate) === formatDate(day.fullDate);

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day.fullDate)}
                      className={`
                        relative min-h-28 p-3 rounded-2xl transition-all transform hover:scale-105
                        ${!day.isCurrentMonth ? 'bg-slate-50/50 text-slate-400' : 'bg-white text-slate-800 shadow-md hover:shadow-xl'}
                        ${today ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-purple-50' : ''}
                        ${selected ? 'ring-2 ring-purple-500 shadow-2xl scale-105' : ''}
                        ${day.isCurrentMonth ? 'hover:shadow-2xl' : ''}
                      `}
                    >
                      <div className="flex flex-col h-full">
                        <span className={`text-base font-bold mb-2 ${today ? 'text-blue-600' : ''}`}>
                          {day.date}
                        </span>
                        
                        {hasEvents && (
                          <div className="flex-1 flex flex-col gap-1.5">
                            {dayEvents.slice(0, 2).map(event => (
                              <div
                                key={event.id}
                                className="text-xs px-2 py-1.5 rounded-lg truncate text-white font-semibold shadow-sm"
                                style={{ backgroundColor: event.color }}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <span className="text-xs text-slate-600 font-bold bg-slate-100 rounded-lg px-2 py-1">
                                +{dayEvents.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                        
                        {conflict && (
                          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full p-1 shadow-lg">
                            <AlertCircle size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Event Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 sticky top-8 border border-white/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Clock size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  {selectedDate ? 'Event Details' : 'Select a Date'}
                </h2>
              </div>

              {selectedDate && (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                  <p className="text-sm font-semibold text-slate-600">Selected Date</p>
                  <p className="text-lg font-bold text-slate-800 mt-1">
                    {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
                  </p>
                </div>
              )}

              {selectedDate ? (
                <>
                  {hasConflict && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl flex items-start gap-3 shadow-lg">
                      <div className="p-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg">
                        <AlertCircle size={20} className="text-white" />
                      </div>
                      <div className="text-sm">
                        <p className="font-bold text-orange-900">Time Conflict!</p>
                        <p className="text-orange-800 mt-1">Some events overlap</p>
                      </div>
                    </div>
                  )}

                  {selectedEvents.length > 0 ? (
                    <div className="space-y-4">
                      {selectedEvents.map(event => (
                        <div
                          key={event.id}
                          className="group p-5 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all transform hover:scale-102 border-l-4"
                          style={{ borderLeftColor: event.color }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-slate-800 text-lg">{event.title}</h3>
                            <div 
                              className="w-3 h-3 rounded-full shadow-lg"
                              style={{ backgroundColor: event.color }}
                            ></div>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                            <Clock size={16} className="text-slate-500" />
                            <span className="font-semibold">{event.time}</span>
                            <span className="text-slate-400">•</span>
                            <span className="font-semibold">{event.duration} min</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-4">
                        <CalendarDays size={40} className="text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">No events scheduled</p>
                      <p className="text-slate-400 text-sm mt-2">Enjoy your free day!</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <CalendarDays size={40} className="text-purple-400" />
                  </div>
                  <p className="text-slate-500 font-medium">Click on a date</p>
                  <p className="text-slate-400 text-sm mt-2">to view event details</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/40">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-purple-500" />
            Event Categories
          </h3>
          <div className="flex flex-wrap gap-4">
            {[...new Set(EVENTS.map(e => ({ title: e.title.split(' ')[0], color: e.color })))].map((cat, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
                <div 
                  className="w-5 h-5 rounded-lg shadow-md" 
                  style={{ backgroundColor: cat.color }}
                ></div>
                <span className="text-sm font-semibold text-slate-700">{cat.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
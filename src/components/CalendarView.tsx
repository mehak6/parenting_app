'use client';

import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  addMonths, 
  subMonths, 
  getDay,
} from 'date-fns';
import { ScheduledActivity } from '../types';

interface CalendarViewProps {
  scheduledActivities: ScheduledActivity[];
  onToggleComplete: (id: string) => void;
  onAddActivity: (date: string) => void;
  onClose: () => void;
}

export default function CalendarView({ 
  scheduledActivities, 
  onToggleComplete, 
  onAddActivity, 
  onClose 
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const startDay = getDay(startOfMonth(currentDate)); // 0 = Sunday

  const getActivitiesForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return scheduledActivities.filter(sa => sa.date === dateStr);
  };

  const selectedActivities = getActivitiesForDate(selectedDate);

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white p-4 pt-8 flex items-center justify-between shadow-sm z-10">
        <button 
          onClick={onClose} 
          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full transition-colors flex items-center gap-1 px-3"
        >
          <span>🏠</span> <span className="text-xs font-bold">Home</span>
        </button>
        <div className="text-center">
          <h1 className="text-blue-500 font-bold tracking-widest text-sm uppercase">Calendar</h1>
        </div>
        <div className="w-16"></div> {/* Spacer for balance */}
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Calendar Card */}
        <div className="bg-white m-4 rounded-3xl shadow-sm p-4">
          
          {/* Month Nav */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="text-gray-400 p-2">‹</button>
            <h2 className="text-lg font-bold text-gray-800">{format(currentDate, 'MMMM yyyy')}</h2>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="text-gray-400 p-2">›</button>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-2">
            {/* Empty slots for start of month */}
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {daysInMonth.map(day => {
              const dateActivities = getActivitiesForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                    isSelected 
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-sm ${isToday && !isSelected ? 'text-blue-500 font-bold' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  
                  {/* Dots for activities */}
                  <div className="flex gap-0.5 mt-1 h-1.5">
                    {dateActivities.slice(0, 3).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/70' : 'bg-blue-400'}`} 
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day List */}
        <div className="px-6 py-2">
          <h3 className="text-gray-500 font-medium mb-4">
            {format(selectedDate, 'EEE, MMM d, yyyy')}
          </h3>

          <div className="space-y-3">
            {selectedActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                <p>No plans for today</p>
                <button 
                  onClick={() => onAddActivity(format(selectedDate, 'yyyy-MM-dd'))}
                  className="mt-2 text-blue-500 text-sm font-bold"
                >
                  + Plan something
                </button>
              </div>
            ) : (
              selectedActivities.map(sa => (
                <div key={sa.id} className="bg-white p-3 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {sa.activityMoods.includes('Active') ? '🏃' : 
                     sa.activityMoods.includes('Creative') ? '🎨' : '✨'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 truncate">{sa.activityName}</h4>
                    <p className="text-xs text-gray-400">
                      {sa.time || 'Anytime'}
                    </p>
                  </div>
                  <button
                    onClick={() => onToggleComplete(sa.id)}
                    className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                      sa.completed 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'border-gray-300 text-transparent hover:border-blue-400'
                    }`}
                  >
                    ✓
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 pointer-events-none">
        <button 
          onClick={() => onAddActivity(format(selectedDate, 'yyyy-MM-dd'))}
          className="pointer-events-auto bg-blue-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-blue-200 flex items-center gap-2 active:scale-95 transition-transform"
        >
          <span>📅</span> Add Activity
        </button>
      </div>
    </div>
  );
}

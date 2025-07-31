import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Habit, HabitLog } from '@/hooks/useHabits';

interface HabitCalendarProps {
  habits: Habit[];
  habitLogs: HabitLog[];
}

export const HabitCalendar: React.FC<HabitCalendarProps> = ({ habits, habitLogs }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const getDayData = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayLogs = habitLogs.filter(log => {
      const logDate = new Date(log.completed_at);
      return (
        logDate.getFullYear() === date.getFullYear() &&
        logDate.getMonth() === date.getMonth() &&
        logDate.getDate() === date.getDate()
      );
    });

    const completedHabits = new Set(dayLogs.map(log => log.habit_id));
    const completionRate = habits.length > 0 ? completedHabits.size / habits.length : 0;

    return {
      logsCount: dayLogs.length,
      completionRate,
      isToday: date.toDateString() === new Date().toDateString(),
    };
  };

  const getIntensityColor = (completionRate: number) => {
    if (completionRate === 0) return 'bg-muted';
    if (completionRate < 0.25) return 'bg-green-200';
    if (completionRate < 0.5) return 'bg-green-300';
    if (completionRate < 0.75) return 'bg-green-400';
    return 'bg-green-500';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Habit Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-32 text-center font-semibold">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekdays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayWeekday }).map((_, index) => (
            <div key={`empty-${index}`} className="w-8 h-8" />
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayData = getDayData(day);
            
            return (
              <div
                key={day}
                className={`
                  w-8 h-8 text-xs flex items-center justify-center rounded cursor-pointer
                  ${getIntensityColor(dayData.completionRate)}
                  ${dayData.isToday ? 'ring-2 ring-primary' : ''}
                  hover:opacity-80 transition-opacity
                `}
                title={`${day}: ${dayData.logsCount} habits completed`}
              >
                {day}
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-muted rounded-sm" />
            <div className="w-3 h-3 bg-green-200 rounded-sm" />
            <div className="w-3 h-3 bg-green-300 rounded-sm" />
            <div className="w-3 h-3 bg-green-400 rounded-sm" />
            <div className="w-3 h-3 bg-green-500 rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
};
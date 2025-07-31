import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { HabitCard } from '@/components/habits/HabitCard';
import { CreateHabitDialog } from '@/components/habits/CreateHabitDialog';
import { HabitStats } from '@/components/habits/HabitStats';
import { HabitCalendar } from '@/components/habits/HabitCalendar';
import { useHabits } from '@/hooks/useHabits';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, Calendar, Home } from 'lucide-react';

export const Dashboard = () => {
  const {
    habits,
    habitLogs,
    loading,
    createHabit,
    logHabit,
    deleteHabit,
    getStreakForHabit,
    getTodayLogsForHabit,
  } = useHabits();

  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-fit grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'overview' && (
              <CreateHabitDialog onCreateHabit={createHabit} />
            )}
          </div>

          <TabsContent value="overview" className="space-y-6">
            {habits.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No habits yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start building better habits by creating your first one!
                </p>
                <CreateHabitDialog onCreateHabit={createHabit} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    streak={getStreakForHabit(habit.id)}
                    todayCount={getTodayLogsForHabit(habit.id).length}
                    onLog={logHabit}
                    onDelete={deleteHabit}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats">
            <HabitStats
              habits={habits}
              habitLogs={habitLogs}
              getStreakForHabit={getStreakForHabit}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <HabitCalendar habits={habits} habitLogs={habitLogs} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
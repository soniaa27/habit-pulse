import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category?: string;
  color: string;
  target_frequency: number;
  is_active: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  completed_at: string;
  duration_minutes: number;
  notes?: string;
}

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchHabits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setHabits(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch habits",
        variant: "destructive",
      });
    }
  };

  const fetchHabitLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setHabitLogs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch habit logs",
        variant: "destructive",
      });
    }
  };

  const createHabit = async (habitData: Omit<Habit, 'id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{ ...habitData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setHabits(prev => [...prev, data]);
      toast({
        title: "Success!",
        description: "Habit created successfully",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create habit",
        variant: "destructive",
      });
    }
  };

  const logHabit = async (habitId: string, durationMinutes: number = 0, notes?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habit_logs')
        .insert([{
          habit_id: habitId,
          user_id: user.id,
          duration_minutes: durationMinutes,
          notes,
        }])
        .select()
        .single();

      if (error) throw error;

      setHabitLogs(prev => [data, ...prev]);
      toast({
        title: "Great job!",
        description: "Habit logged successfully",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log habit",
        variant: "destructive",
      });
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('habits')
        .update({ is_active: false })
        .eq('id', habitId)
        .eq('user_id', user.id);

      if (error) throw error;

      setHabits(prev => prev.filter(habit => habit.id !== habitId));
      toast({
        title: "Habit deleted",
        description: "Habit has been removed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
      });
    }
  };

  const getStreakForHabit = (habitId: string): number => {
    const habitLogsForHabit = habitLogs
      .filter(log => log.habit_id === habitId)
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < habitLogsForHabit.length; i++) {
      const logDate = new Date(habitLogsForHabit[i].completed_at);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      // Check if log is from expected date (within same day)
      if (
        logDate.getFullYear() === expectedDate.getFullYear() &&
        logDate.getMonth() === expectedDate.getMonth() &&
        logDate.getDate() === expectedDate.getDate()
      ) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const getTodayLogsForHabit = (habitId: string): HabitLog[] => {
    const today = new Date();
    return habitLogs.filter(log => {
      const logDate = new Date(log.completed_at);
      return (
        log.habit_id === habitId &&
        logDate.getFullYear() === today.getFullYear() &&
        logDate.getMonth() === today.getMonth() &&
        logDate.getDate() === today.getDate()
      );
    });
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchHabits(), fetchHabitLogs()]).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  return {
    habits,
    habitLogs,
    loading,
    createHabit,
    logHabit,
    deleteHabit,
    getStreakForHabit,
    getTodayLogsForHabit,
    refetch: () => Promise.all([fetchHabits(), fetchHabitLogs()]),
  };
};
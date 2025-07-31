import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Flame, Plus, Trash2 } from 'lucide-react';
import { Habit } from '@/hooks/useHabits';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface HabitCardProps {
  habit: Habit;
  streak: number;
  todayCount: number;
  onLog: (habitId: string, duration?: number) => void;
  onDelete: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  streak,
  todayCount,
  onLog,
  onDelete,
}) => {
  const [isLogging, setIsLogging] = useState(false);
  const [duration, setDuration] = useState(0);

  const progress = Math.min((todayCount / habit.target_frequency) * 100, 100);
  const isCompleted = todayCount >= habit.target_frequency;

  const handleQuickLog = async () => {
    setIsLogging(true);
    await onLog(habit.id, duration);
    setDuration(0);
    setIsLogging(false);
  };

  return (
    <Card className="relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-1 h-full" 
        style={{ backgroundColor: habit.color }}
      />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{habit.title}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Habit</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{habit.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(habit.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        {habit.description && (
          <p className="text-sm text-muted-foreground">{habit.description}</p>
        )}
        
        {habit.category && (
          <Badge variant="secondary" className="w-fit">
            {habit.category}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>{streak} day streak</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>{todayCount}/{habit.target_frequency} today</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Daily Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleQuickLog}
            disabled={isLogging || isCompleted}
            className="flex-1"
            variant={isCompleted ? "secondary" : "default"}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Log
              </>
            )}
          </Button>
          
          {!isCompleted && (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                placeholder="0"
                className="w-16 px-2 py-1 text-sm border rounded"
                min="0"
              />
              <span className="text-xs text-muted-foreground">min</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import {
  CheckCircle,
  Circle,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Habit } from "@/lib/types";
import { cn } from "@/lib/utils";
import { shouldShowHabitForDate } from "@/lib/habit-utils";
import { useToast } from "@/components/ui/use-toast";
import EditHabitDialog from "./edit-habit-dialog";

interface HabitsListProps {
  habits: Habit[];
  onUpdateLog: (habitId: string, date: string, value: number | boolean) => void;
  onDeleteHabit: (habitId: string) => void;
  onUpdateHabit: (updatedHabit: Habit) => void;
}

export default function HabitsList({
  habits,
  onUpdateLog,
  onDeleteHabit,
  onUpdateHabit,
}: HabitsListProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  const previousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const nextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const getLogValue = (habit: Habit, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const log = habit.logs.find((log) => log.date === dateStr);
    return log ? log.value : null;
  };

  const handleToggleCompletion = (habit: Habit, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const currentValue = getLogValue(habit, date);

    if (habit.completionType === "boolean") {
      onUpdateLog(habit.id, dateStr, currentValue === true ? false : true);
      toast({
        title: `Habit ${currentValue === true ? "uncompleted" : "completed"}`,
        description: `${habit.name} has been marked as ${
          currentValue === true ? "not done" : "done"
        } for ${format(date, "MMM d, yyyy")}.`,
      });
    }
  };

  const handlePercentageChange = (habit: Habit, date: Date, value: number) => {
    const dateStr = format(date, "yyyy-MM-dd");
    onUpdateLog(habit.id, dateStr, value);
    toast({
      title: "Habit progress updated",
      description: `${habit.name} progress set to ${value}% for ${format(
        date,
        "MMM d, yyyy"
      )}.`,
    });
  };

  const confirmDelete = () => {
    if (habitToDelete) {
      onDeleteHabit(habitToDelete.id);
      toast({
        title: "Habit deleted",
        description: `${habitToDelete.name} has been successfully removed.`,
      });
      setHabitToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (habit: Habit) => {
    setHabitToDelete(habit);
    setDeleteDialogOpen(true);
  };

  const calculateStreak = (habit: Habit): number => {
    let streak = 0;
    const today = new Date();
    let currentDate = today;

    // Sort logs by date in descending order
    const sortedLogs = [...habit.logs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Check if there's a log for today
    const todayStr = format(today, "yyyy-MM-dd");
    const hasTodayLog = sortedLogs.some(
      (log) =>
        log.date === todayStr &&
        (log.value === true ||
          (typeof log.value === "number" && log.value >= 100))
    );

    // If no log for today, check if there's one for yesterday to continue the streak
    if (!hasTodayLog) {
      const yesterdayStr = format(addDays(today, -1), "yyyy-MM-dd");
      const hasYesterdayLog = sortedLogs.some(
        (log) =>
          log.date === yesterdayStr &&
          (log.value === true ||
            (typeof log.value === "number" && log.value >= 100))
      );

      if (!hasYesterdayLog) {
        return 0; // Streak broken
      }
    }

    // Count consecutive days with completed habits
    for (let i = 0; i < 365; i++) {
      // Limit to a year
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const log = sortedLogs.find((log) => log.date === dateStr);

      const isCompleted =
        log &&
        (log.value === true ||
          (typeof log.value === "number" && log.value >= 100));

      if (isCompleted) {
        streak++;
        currentDate = addDays(currentDate, -1);
      } else {
        break;
      }
    }

    return streak;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={previousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={goToCurrentWeek}>
          {format(currentWeekStart, "MMM d")} -{" "}
          {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
        </Button>
        <Button variant="outline" size="icon" onClick={nextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-8 gap-2 mb-4">
        <div className="font-medium text-sm text-muted-foreground md:col-span-2 hidden md:block">
          Habit
        </div>
        <div className="grid grid-cols-7 gap-2 md:col-span-6">
          {weekDays.map((day, i) => (
            <div
              key={i}
              className={cn(
                "text-center font-medium text-sm",
                isSameDay(day, new Date())
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div>{format(day, "EEE")}</div>
              <div>{format(day, "d")}</div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {habits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-10 text-muted-foreground"
          >
            No habits added yet. Add your first habit to start tracking!
          </motion.div>
        ) : (
          habits.map((habit) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-8 gap-2 items-center py-3 border-b border-dashed border-gray-200"
            >
              {/* Habit name section - full width on mobile, first column on desktop */}
              <div className="col-span-2 mb-3 md:mb-0">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center min-w-0 pr-2">
                    <div className="max-w-[200px] md:max-w-[120px] overflow-hidden">
                      <span
                        className="font-handwriting text-lg truncate block"
                        title={habit.name}
                      >
                        {habit.name}
                      </span>
                    </div>
                    {calculateStreak(habit) > 0 && (
                      <div
                        className="ml-1 flex-shrink-0 flex items-center text-orange-500"
                        title={`${calculateStreak(habit)} day streak`}
                      >
                        <Flame className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">
                          {calculateStreak(habit)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-1 flex-shrink-0">
                    <EditHabitDialog
                      habit={habit}
                      onUpdateHabit={onUpdateHabit}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => openDeleteDialog(habit)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Days of the week - span remaining columns on desktop, full width on mobile */}
              <div className="col-span-6 grid grid-cols-7 gap-2">
                {weekDays.map((day, i) => {
                  const shouldShow = shouldShowHabitForDate(habit, day);
                  const logValue = getLogValue(habit, day);

                  return (
                    <div key={i} className="flex justify-center items-center">
                      {shouldShow ? (
                        habit.completionType === "boolean" ? (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleCompletion(habit, day)}
                            className="focus:outline-none"
                          >
                            {logValue === true ? (
                              <CheckCircle className="h-8 w-8 text-green-500" />
                            ) : (
                              <Circle className="h-8 w-8 text-gray-300" />
                            )}
                          </motion.button>
                        ) : (
                          <div className="w-full px-1">
                            <Slider
                              value={[(logValue as number) ?? 0]}
                              min={0}
                              max={100}
                              step={5}
                              onValueChange={(value) =>
                                handlePercentageChange(habit, day, value[0])
                              }
                              className="w-full"
                            />
                            <div className="text-xs text-center mt-1">
                              {logValue !== null ? `${logValue}%` : "0%"}
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Habit</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete "{habitToDelete?.name}"? This
              action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

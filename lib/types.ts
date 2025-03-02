export interface HabitLog {
  date: string;
  value: boolean | number;
}

export interface Habit {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "custom";
  completionType: "boolean" | "percentage";
  selectedDays: number[]; // 0 = Monday, 1 = Tuesday, etc.
  logs: HabitLog[];
  createdAt: string;
}

export type View = "week" | "month" | "overall";

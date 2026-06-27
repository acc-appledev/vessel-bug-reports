import { format, subDays, differenceInCalendarDays } from "date-fns";

export const todayStr = () => format(new Date(), "yyyy-MM-dd");

export const daysBack = (n) => {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    arr.push(format(subDays(new Date(), i), "yyyy-MM-dd"));
  }
  return arr;
};

// Compute current streak from an array of completion date strings (yyyy-MM-dd)
export const computeStreak = (dateStrs) => {
  if (!dateStrs || dateStrs.length === 0) return 0;
  const set = new Set(dateStrs);
  let streak = 0;
  let d = new Date();
  while (set.has(format(d, "yyyy-MM-dd"))) {
    streak++;
    d = subDays(d, 1);
  }
  return streak;
};

export const daysSince = (dateStr) => {
  if (!dateStr) return 0;
  return differenceInCalendarDays(new Date(), new Date(dateStr));
};
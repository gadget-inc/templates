import { differenceInDays } from "date-fns";

export default (
  usedTrialDays = 0,
  usedTrialDaysUpdatedAt,
  today,
  defaultTrialDays
) => {
  const usedDays =
    differenceInDays(
      today,
      usedTrialDaysUpdatedAt ? new Date(usedTrialDaysUpdatedAt) : today
    ) + usedTrialDays;

  return {
    usedTrialDays: Math.min(defaultTrialDays, usedDays),
    availableTrialDays: Math.max(0, defaultTrialDays - usedDays),
  };
};

import { differenceInDays } from "date-fns";

/**
 * @type { (usedTrialDays: number | undefined, usedTrialDaysUpdatedAt: Date, today: Date, defaultTrialDays: number) => {usedTrialDays: number, availableTrialDays: number} }
 *
 * A function used to return trial information for the current shop
 */
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

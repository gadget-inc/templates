import { differenceInMinutes } from "date-fns";

/**
 * @type { (usedTrialMinutes: number | undefined, usedTrialMinutesUpdatedAt: Date, today: Date, defaultTrialDays: number) => {usedTrialMinutes: number, availableTrialDays: number} }
 *
 * A function used to return trial information for the current shop
 */
export default (
  usedTrialMinutes = 0,
  usedTrialMinutesUpdatedAt,
  today,
  defaultTrialDays
) => {
  const usedMinutes =
    differenceInMinutes(
      today,
      usedTrialMinutesUpdatedAt ? new Date(usedTrialMinutesUpdatedAt) : today
    ) + usedTrialMinutes;

  return {
    usedTrialMinutes: Math.min(defaultTrialDays * 24 * 60, usedMinutes),
    availableTrialDays: Math.max(
      0,
      Math.round(defaultTrialDays - usedMinutes / 60 / 24)
    ),
  };
};

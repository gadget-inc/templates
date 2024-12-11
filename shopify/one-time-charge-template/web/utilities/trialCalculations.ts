import { differenceInMinutes } from "date-fns";

export default (
  usedTrialMinutes = 0,
  trialStartedAt: Date | null,
  today: Date,
  defaultTrialDays: number
) => {
  const usedMinutes =
    differenceInMinutes(
      today,
      trialStartedAt ? new Date(trialStartedAt) : today
    ) + usedTrialMinutes;

  return {
    usedTrialMinutes: Math.min(defaultTrialDays * 24 * 60, usedMinutes),
    availableTrialDays: Math.max(
      0,
      Math.round(defaultTrialDays - usedMinutes / 60 / 24)
    ),
  };
};

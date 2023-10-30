import { DateTime } from "luxon";

/**
 * @param { string } timezone The shop's ianaTimezone
 * @param { Date | null | undefined } date The date used as a day marker
 *
 * @returns { { dayLowerBound: Date, dayUpperBound: Date } } The days in the month for the date provided
 */
export default (timezone, date = new Date()) => {
  const dt = DateTime.fromJSDate(date, {
    zone: timezone,
  });

  return {
    dayLowerBound: dt.startOf("day").toJSDate(),
    dayUpperBound: dt.endOf("day").toJSDate(),
  };
};

import { DateTime } from "luxon";

/**
 * @param { string } timezone The shop's ianaTimezone
 * @param { Date | null | undefined } date The date used as a month marker
 *
 * @returns { { monthLowerBound: Date, monthUpperBound: Date } } The days in the month for the date provided
 */
export default (timezone, date = new Date()) => {
  const dt = DateTime.fromJSDate(date, {
    zone: timezone,
  });

  return {
    monthLowerBound: dt.startOf("month").toJSDate(),
    monthUpperBound: dt.endOf("month").toJSDate(),
  };
};

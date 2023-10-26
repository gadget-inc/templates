import { DateTime } from "luxon";

export default (timezone, date = new Date()) => {
  const dt = DateTime.fromJSDate(date, {
    zone: timezone,
  });

  const dayLowerBound = dt.startOf("day").toJSDate();
  const dayUpperBound = dt.endOf("day").toJSDate();

  return { dayLowerBound, dayUpperBound };
};

import { DateTime } from "luxon";

export default (timezone, date = new Date()) => {
  const dt = DateTime.fromJSDate(date, {
    zone: timezone,
  });
  const monthLowerBound = dt.startOf("month").toJSDate();
  const monthUpperBound = dt.endOf("month").toJSDate();

  return { monthLowerBound, monthUpperBound };
};

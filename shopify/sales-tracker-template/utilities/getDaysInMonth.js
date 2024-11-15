/**
 * @param { Date | null | undefined } date The date used as a month marker
 *
 * @returns { number } The days in the month for the date provided
 */
export default (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

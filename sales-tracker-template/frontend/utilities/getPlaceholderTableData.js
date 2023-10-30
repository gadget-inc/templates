/**
 * @param { Date } [date] A JS Date object
 *
 * @returns { number } The days in the current month
 */
const getDaysInMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * @param { Date } [date] A JS Date object
 *
 * @returns { [{node: {id: string, target: number, sales: number, percentage: number}}] } An array of empty placeholder data
 */
export default (date = new Date()) => {
  const days = getDaysInMonth(date);
  const arr = [];

  for (let i = 1; i <= days; i++) {
    arr.push({
      node: { id: i.toString(), sales: 0, target: 0, percentage: 0 },
    });
  }
  return arr;
};

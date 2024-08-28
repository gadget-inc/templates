import { groupBy } from "lodash";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const groupByDateBuckets = (data, dateKey) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const oneDay = 24 * 60 * 60 * 1000;
  const yesterdayStart = new Date(todayStart.getTime() - oneDay);
  const sevenDaysAgoStart = new Date(todayStart.getTime() - 7 * oneDay);
  const thirtyDaysAgoStart = new Date(todayStart.getTime() - 30 * oneDay);

  return groupBy(data, item => {
    const itemDate = item[dateKey];

    if (itemDate >= todayStart) return "Today";
    if (itemDate >= yesterdayStart && itemDate < todayStart) return "Yesterday";
    if (itemDate >= sevenDaysAgoStart && itemDate < yesterdayStart) return "Previous 7 days";
    if (itemDate >= thirtyDaysAgoStart && itemDate < sevenDaysAgoStart) return "Previous 30 days";

    return `${monthNames[itemDate.getMonth()]} ${itemDate.getFullYear()}`;
  });
}
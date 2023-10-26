const getDaysInMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export default (date) => {
  const days = getDaysInMonth(date);
  const arr = [];

  for (let i = 1; i <= days; i++) {
    arr.push({
      node: { id: i.toString(), sales: 0, target: 0, percentage: 0 },
    });
  }
  return arr;
};

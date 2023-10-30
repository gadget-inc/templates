export default /** @type {const} */ ({
  id: true,
  target: true,
  sales: true,
  percentage: true,
  startDate: true,
  salesDays: {
    edges: {
      node: {
        id: true,
        target: true,
        sales: true,
        percentage: true,
        startDate: true,
      },
    },
  },
});

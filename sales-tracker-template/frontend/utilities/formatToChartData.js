export default (inputArr) => {
  const arr = [
    {
      name: "Sales",
      data: [],
    },
    {
      name: "Target",
      data: [],
    },
  ];

  let dayNumber = 1;

  for (const day of inputArr) {
    arr[0].data.push({
      key: `Day ${dayNumber}`,
      value: day?.node?.sales || 0,
    });
    arr[1].data.push({
      key: `Day ${dayNumber}`,
      value: day?.node?.target || 0,
    });
    dayNumber++;
  }

  return arr;
};

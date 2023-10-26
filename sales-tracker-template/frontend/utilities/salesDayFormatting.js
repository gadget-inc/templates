export const formatTableDataForUpdate = (tableData) => {
  const arr = [];

  for (const day of tableData) {
    arr.push({
      update: {
        id: day?.node?.id,
        target: day?.node?.target,
      },
    });
  }

  return arr;
};

export const formatTableDataForCreation = (tableData) => {
  const arr = [];

  for (const day of tableData) {
    arr.push({
      index: day?.node?.id,
      target: day?.node?.target,
    });
  }

  return arr;
};

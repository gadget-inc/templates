/**
 * @param { [{node: {id: string, target: number, sales: number, percentage: number, startDate: Date}}] } tableData Array of current table data
 *
 * @returns { [{update: { id: string, target: number}}] } A salesDays "update" array
 */
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

/**
 * @param { [{node: {id: string, target: number, sales: number, percentage: number, startDate: Date}}] } tableData Array of current table data
 *
 * @returns { [{index: number, target: number}] } An array formatted for salesDay creations
 */
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

/**
 * @module Utilities The index for exporting all utilities functions in this folder
 * @exports (formatToChartData) A utility function for formatting tableData into Shopify Polaris Viz BarChart ready data
 * @exports (getPlaceholderTableData) A utility function for making blank table data
 * @exports (getNewSalesDayTargets) A utility function for getting a new array of sales targets (input by user.)
 * @exports (formatTableDataForUpdate) A utility for formatting tableData for salesMonth/salesDay database update
 * @exports (formatTableDataForCreation) A utility for formatting tableData for salesMonth/salesDay record creation
 */

export { default as formatToChartData } from "./formatToChartData";
export { default as getPlaceholderTableData } from "./getPlaceholderTableData";
export { default as getNewSalesDayTargets } from "./getNewSalesDayTargets";
export { formatTableDataForUpdate } from "./salesDayFormatting";
export { formatTableDataForCreation } from "./salesDayFormatting";

import {
  useMaybeFindFirst,
  useAction,
  useGlobalAction,
} from "@gadgetinc/react";
import { Layout, Page, Toast, Frame } from "@shopify/polaris";
import { BarChart } from "@shopify/polaris-viz";
import { api } from "./api";
import { useCallback, useEffect, useState } from "react";
import { DateSelector, Table, TableHeader } from "./components";
import { DateTime } from "luxon";
import {
  getPlaceholderTableData,
  formatToChartData,
  getNewSalesDayTargets,
  formatTableDataForUpdate,
  formatTableDataForCreation,
} from "./utilities";
import { cloneDeep, isEqual } from "lodash";
import { SalesMonthSelect } from "./selections";
import "./App.css";

const initialDate = new Date();

export default ({ currency, timezone }) => {
  const [date, setDate] = useState(initialDate);
  console.log("DATE", date.toISOString());
  const [chartData, setChartData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [monthlyTarget, setMonthlyTarget] = useState("");
  const [changed, setChanged] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({
    content: "",
    error: false,
  });

  const options = {
    live: true,
    filter: {
      AND: [
        {
          startDate: {
            lessThanOrEqual: date,
          },
        },
        {
          endDate: {
            greaterThanOrEqual: date,
          },
        },
      ],
    },
    select: SalesMonthSelect,
  };

  const [
    {
      data: salesMonth,
      fetching: fetchingSalesMonth,
      error: errorFetchingSalesMonth,
    },
  ] = useMaybeFindFirst(api.salesMonth, options);

  const [
    {
      data: salesMonthUpdateData,
      fetching: updatingSalesMonth,
      error: errorUpdatingSalesMonth,
    },
    updateSalesMonth,
  ] = useAction(api.salesMonth.update);

  const [
    {
      data: salesMonthCreateData,
      fetching: creatingSalesMonth,
      error: errorCreatingSalesMonth,
    },
    populateSalesMonth,
  ] = useGlobalAction(api.populateSalesMonth);

  /**
   * @type { () => void }
   * Callback for toggling the toast
   */
  const toggleToast = useCallback(
    () => setShowToast((showToast) => !showToast),
    []
  );

  /**
   * @type { (value: string) => void }
   * Callback for handling a change to the monthly target
   */
  const handleMonthlyTargetChange = useCallback(
    (value) => {
      if (
        /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(value) ||
        value === ""
      ) {
        const arr = getNewSalesDayTargets(tableData, value);

        setTableData(arr);
        setMonthlyTarget(value);
      }
    },
    [tableData]
  );

  /**
   * @type { () => void }
   * Callback for creating a new or updating the current salesMonth
   */
  const handleSave = useCallback(async () => {
    if (salesMonth?.id) {
      const salesDays = formatTableDataForUpdate(tableData);

      await updateSalesMonth({
        id: salesMonth.id,
        target: monthlyTarget ? parseFloat(monthlyTarget) : salesMonth.target,
        salesDays,
      });
    } else {
      const days = formatTableDataForCreation(tableData);

      await populateSalesMonth({
        month: {
          date: date.toString(),
          target: monthlyTarget ? parseFloat(monthlyTarget) : 0,
        },
        days,
        shop: {
          timezone,
        },
      });
    }
  }, [monthlyTarget, tableData, date, timezone]);

  /**
   * @type { () => void }
   * Callback for clearing a monthly target change
   */
  const handleClear = useCallback(() => {
    setMonthlyTarget("");
    setTableData(cloneDeep(originalData) || []);
  }, [originalData]);

  /**
   * @type { () => void }
   * Callback function for changing to previous month
   */
  const handlePreviousMonth = useCallback(() => {
    setDate(DateTime.fromJSDate(date).minus({ months: 1 }).toJSDate());
  }, [date]);

  /**
   * @type { () => void }
   * Callback function for changing to next month
   */
  const handleNextMonth = useCallback(() => {
    setDate(DateTime.fromJSDate(date).plus({ months: 1 }).toJSDate());
  }, [date]);

  /**
   * @type {  (index: number, value: string) => void }
   * Callback function for changing a salesDay's target value
   */
  const handleSalesDayTargetChange = useCallback(
    (index, value) => {
      const arr = [...tableData];
      const parsedValue = parseFloat(value);

      arr[index].node.target = isNaN(parsedValue) ? 0 : parsedValue;

      let sum = 0;

      for (const day of arr) {
        sum += day?.node?.target;
      }

      setTableData(arr);
      setMonthlyTarget(sum.toFixed(2));
    },
    [tableData]
  );

  // useEffect for checking the deep equality of the original and the current tableData array
  useEffect(() => {
    if (!isEqual(originalData, tableData)) {
      setChanged(true);
    } else {
      setChanged(false);
    }
  }, [originalData, tableData]);

  // useEffect for populating chart and table data, as well as clearing the monthly target input
  useEffect(() => {
    if (!fetchingSalesMonth) {
      if (salesMonth) {
        setMonthlyTarget("");
        setOriginalData(cloneDeep(salesMonth?.salesDays?.edges) || []);
        setTableData(cloneDeep(salesMonth?.salesDays?.edges) || []);
        const arr = formatToChartData(
          cloneDeep(salesMonth?.salesDays?.edges) || []
        );
        setChartData(arr);
      } else {
        const placeholderData = getPlaceholderTableData(date);
        const arr = formatToChartData(cloneDeep(placeholderData) || []);
        setMonthlyTarget("");
        setOriginalData(cloneDeep(placeholderData) || []);
        setTableData(placeholderData);
        setChartData(arr);
      }
    }
  }, [salesMonth, fetchingSalesMonth, date]);

  // useEffect for when there's an error fetching a salesMonth record
  useEffect(() => {
    if (!fetchingSalesMonth && errorFetchingSalesMonth) {
      setToastContent({ content: "Failed to fetch month", error: true });
      toggleToast();
      console.error(errorFetchingSalesMonth);
    }
  }, [fetchingSalesMonth, errorFetchingSalesMonth]);

  // useEffect for when there's an error updating a salesMonth record
  useEffect(() => {
    if (!updatingSalesMonth && errorUpdatingSalesMonth) {
      setToastContent({ content: "Failed to update month", error: true });
      toggleToast();
      console.error(errorUpdatingSalesMonth);
    }
  }, [updatingSalesMonth, errorUpdatingSalesMonth]);

  // useEffect for when there's an error creating a salesMonth record
  useEffect(() => {
    if (!creatingSalesMonth && errorCreatingSalesMonth) {
      setToastContent({ content: "Failed to create month", error: true });
      toggleToast();
      console.error(errorCreatingSalesMonth);
    }
  }, [creatingSalesMonth, errorCreatingSalesMonth]);

  // useEffect for when a salesMonth record is updated successfully
  useEffect(() => {
    if (!updatingSalesMonth && salesMonthUpdateData) {
      setToastContent({ content: "Month updated", error: false });
      toggleToast();
    }
  }, [updatingSalesMonth, salesMonthUpdateData]);

  // useEffect for when a salesMonth record is created successfully
  useEffect(() => {
    if (!creatingSalesMonth && salesMonthCreateData) {
      setToastContent({ content: "Month created", error: false });
      toggleToast();
    }
  }, [creatingSalesMonth, salesMonthCreateData]);

  return (
    <Frame>
      <Page
        title={`${DateTime.fromJSDate(date).toLocaleString({
          month: "long",
          year: "numeric",
        })}`}
        subtitle="View and edit your targets"
        primaryAction={
          <DateSelector
            fetchingSalesMonth={fetchingSalesMonth}
            handlePreviousMonth={handlePreviousMonth}
            handleNextMonth={handleNextMonth}
          />
        }
      >
        <Layout>
          <Layout.Section>
            <BarChart
              data={chartData}
              emptyStateText="No sales data"
              yAxisOptions={{
                labelFormatter: (y) => `${y} ${currency || "CAD"}`,
              }}
            />
          </Layout.Section>
          <Layout.Section>
            <TableHeader
              salesMonth={salesMonth}
              handleMonthlyTargetChange={handleMonthlyTargetChange}
              monthlyTarget={monthlyTarget}
              currency={currency}
              handleSave={handleSave}
              changed={changed}
              fetchingSalesMonth={fetchingSalesMonth}
              updatingSalesMonth={updatingSalesMonth}
              creatingSalesMonth={creatingSalesMonth}
              handleClear={handleClear}
            />
          </Layout.Section>
          <Layout.Section>
            <Table
              tableData={tableData}
              currency={currency}
              handleSalesDayTargetChange={handleSalesDayTargetChange}
            />
          </Layout.Section>
        </Layout>
        {showToast && (
          <Toast
            content={toastContent.content}
            error={toastContent.error}
            onDismiss={toggleToast}
          />
        )}
      </Page>
    </Frame>
  );
};

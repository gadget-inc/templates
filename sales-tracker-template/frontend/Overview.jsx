"use strict";
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
import "./App.css";

export default ({ currency, timezone }) => {
  const [date, setDate] = useState(new Date());
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

  const [
    {
      data: salesMonth,
      fetching: fetchingSalesMonth,
      error: errorFetchingSalesMonth,
    },
  ] = useMaybeFindFirst(api.salesMonth, {
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
    select: {
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
    },
  });

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

  const toggleToast = useCallback(
    () => setShowToast((showToast) => !showToast),
    []
  );

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

  const handleClear = useCallback(() => {
    setMonthlyTarget("");
    setTableData(cloneDeep(originalData) || []);
  }, [originalData]);

  const handlePreviousMonth = useCallback(() => {
    setDate(DateTime.fromJSDate(date).minus({ months: 1 }).toJSDate());
  }, [date]);

  const handleNextMonth = useCallback(() => {
    setDate(DateTime.fromJSDate(date).plus({ months: 1 }).toJSDate());
  }, [date]);

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

  useEffect(() => {
    if (!isEqual(originalData, tableData)) {
      setChanged(true);
    } else {
      setChanged(false);
    }
  }, [originalData, tableData]);

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

  useEffect(() => {
    if (!fetchingSalesMonth && errorFetchingSalesMonth) {
      setToastContent({ content: "Failed to fetch month", error: true });
      toggleToast();
      console.error(errorFetchingSalesMonth);
    }
  }, [fetchingSalesMonth, errorFetchingSalesMonth]);

  useEffect(() => {
    if (!updatingSalesMonth && errorUpdatingSalesMonth) {
      setToastContent({ content: "Failed to update month", error: true });
      toggleToast();
      console.error(errorUpdatingSalesMonth);
    }
  }, [updatingSalesMonth, errorUpdatingSalesMonth]);

  if (errorUpdatingSalesMonth) {
    console.log(errorUpdatingSalesMonth);
  }
  if (errorFetchingSalesMonth) {
    console.log(errorFetchingSalesMonth);
  }

  useEffect(() => {
    if (!creatingSalesMonth && errorCreatingSalesMonth) {
      setToastContent({ content: "Failed to create month", error: true });
      toggleToast();
      console.error(errorCreatingSalesMonth);
    }
  }, [creatingSalesMonth, errorCreatingSalesMonth]);

  useEffect(() => {
    if (!updatingSalesMonth && salesMonthUpdateData) {
      setToastContent({ content: "Month updated", error: false });
      toggleToast();
    }
  }, [updatingSalesMonth, salesMonthUpdateData]);

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
            date={date}
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

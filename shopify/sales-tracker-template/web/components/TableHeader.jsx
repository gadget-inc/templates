import { Button, Card, InlineStack, TextField, Text } from "@shopify/polaris";
import "../App.css";
import { SalesMonthSelect } from "../selections";

/** @typedef {import("@gadget-client/sales-tracker-template").GadgetRecord<import("@gadget-client/sales-tracker-template").Select<import("@gadget-client/sales-tracker-template").SalesMonth, typeof SalesMonthSelect>>} SalesMonthRecord */

/**
 * @param { {salesMonth: SalesMonthRecord | null | undefined, handleMonthlyTargetChange: (value: string) => void, monthlyTarget: string, currency: string, changed: boolean, fetchingSalesMonth: boolean, updatingSalesMonth: boolean, creatingSalesMonth: boolean, handleClear: () => void } } props The props passed to the React functional component
 *
 * @returns { import("react").ReactElement } A React functional component
 */
export default ({
  salesMonth,
  handleMonthlyTargetChange,
  monthlyTarget,
  currency,
  handleSave,
  changed,
  fetchingSalesMonth,
  updatingSalesMonth,
  creatingSalesMonth,
  handleClear,
}) => {
  return (
    <div id="table-header">
      <InlineStack gap="300" wrap={false} blockAlign="end">
        <TextField
          label="Monthly Target"
          placeholder={salesMonth?.target || 0}
          onChange={handleMonthlyTargetChange}
          value={monthlyTarget || ""}
          type="currency"
          autoComplete="off"
          suffix={currency || "CAD"}
        />
        <Button
          onClick={handleSave}
          disabled={!changed || fetchingSalesMonth}
          loading={updatingSalesMonth || creatingSalesMonth}
          submit
          tone="success"
          variant="primary"
        >
          Save
        </Button>
        <Button onClick={handleClear} disabled={!changed}>
          Clear
        </Button>
      </InlineStack>
      <Card>
        <InlineStack gap="500" columns={2}>
          <InlineStack gap="200" wrap={false}>
            <Text as="h3" variant="headingSm">
              Percentage:{" "}
            </Text>
            <Text as="p" variant="bodyLg">
              {salesMonth?.percentage
                ? `${(salesMonth?.percentage * 100).toFixed(2)}%`
                : "0%"}
            </Text>
          </InlineStack>
          <div id="divider"></div>
          <InlineStack gap="200" wrap={false}>
            <Text as="h3" variant="headingSm">
              Total sales ({currency}):
            </Text>
            <Text as="p" variant="bodyLg">
              {salesMonth?.sales || 0}
            </Text>
          </InlineStack>
        </InlineStack>
      </Card>
    </div>
  );
};

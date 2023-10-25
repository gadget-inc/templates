import { Button, Card, InlineStack, TextField, Text } from "@shopify/polaris";
import "../App.css";

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

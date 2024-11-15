import { InlineStack, ButtonGroup, Button } from "@shopify/polaris";
import { ChevronLeftMinor, ChevronRightMinor } from "@shopify/polaris-icons";
import "../App.css";

export default ({
  fetchingSalesMonth,
  handlePreviousMonth,
  handleNextMonth,
}) => {
  return (
    <InlineStack wrap={false}>
      <div id="dateSelector">
        <ButtonGroup gap="extraTight">
          <Button
            size="large"
            disabled={fetchingSalesMonth}
            onClick={handlePreviousMonth}
            icon={ChevronLeftMinor}
          ></Button>
          <Button
            size="large"
            disabled={fetchingSalesMonth}
            onClick={handleNextMonth}
            icon={ChevronRightMinor}
          ></Button>
        </ButtonGroup>
      </div>
    </InlineStack>
  );
};

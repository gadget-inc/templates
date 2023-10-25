import { Icon, IndexTable, TextField } from "@shopify/polaris";
import { EditMinor } from "@shopify/polaris-icons";
import "../App.css";
import { useCallback } from "react";

export default ({
  id,
  sales,
  target,
  percentage,
  index,
  handleSalesDayTargetChange,
}) => {
  const handleChange = useCallback(
    (value) => {
      if (
        /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(value) ||
        value === ""
      ) {
        handleSalesDayTargetChange(index, value);
      }
    },
    [index]
  );

  return (
    <IndexTable.Row id={id} position={index}>
      <IndexTable.Cell>{index + 1}</IndexTable.Cell>
      <IndexTable.Cell>{`${percentage || 0}%`}</IndexTable.Cell>
      <IndexTable.Cell>{sales || 0}</IndexTable.Cell>
      <IndexTable.Cell className="cellAlign">
        <TextField
          placeholder={target}
          suffix={<Icon source={EditMinor} color="subdued" />}
          onChange={handleChange}
          variant="borderless"
          value={target || ""}
          autoComplete="off"
        />
      </IndexTable.Cell>
    </IndexTable.Row>
  );
};

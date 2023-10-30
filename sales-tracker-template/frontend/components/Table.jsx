import { IndexTable } from "@shopify/polaris";
import TableRow from "./TableRow";
import "../App.css";

/**
 * @param { {tableData: [{node: {id: string, target: number, sales: number, percentage: number, startDate: Date}}], currency: string, handleSalesDayTargetChange: (index: number, value: string) => void } } props The props passed to the React functional component
 *
 * @returns { import("react").ReactElement } A React functional component
 */
export default ({ tableData, currency, handleSalesDayTargetChange }) => {
  return (
    <div id="data-table">
      <IndexTable
        selectable={false}
        resourceName={{
          singular: "Sales Day",
          plural: "Sales Days",
        }}
        itemCount={tableData.length}
        headings={[
          { title: "Day" },
          { title: "Percentage" },
          {
            title: `Sales (${currency || "CAD"})`,
          },
          { title: `Target (${currency || "CAD"})` },
        ]}
      >
        {tableData.map(({ node: { id, sales, target, percentage } }, index) => (
          <TableRow
            id={id}
            sales={sales}
            target={target}
            percentage={(percentage * 100).toFixed(2)}
            index={index}
            key={id}
            handleSalesDayTargetChange={handleSalesDayTargetChange}
          />
        ))}
      </IndexTable>
    </div>
  );
};

import { ActionTrigger, CreateShopifyOrderActionContext } from "gadget-server";

export const setReviewCreationLimit = ({
  trigger,
  record,
}: {
  trigger: ActionTrigger;
  record: CreateShopifyOrderActionContext["record"];
}) => {
  if (
    trigger.type == "shopify_webhook" &&
    (trigger.topic == "orders/create" || trigger.topic == "orders/updated")
  ) {
    const products = (
      trigger.payload.line_items as { product_id: string; }[]
    ).reduce(
      (acc: { product_id: string; }[], current: { product_id: string; }) => {
        if (
          !acc.some((line_item) => line_item.product_id === current.product_id)
        ) {
          acc.push(current);
        }
        return acc;
      },
      []
    );

    record.reviewCreationLimit = products.length;
  }
};

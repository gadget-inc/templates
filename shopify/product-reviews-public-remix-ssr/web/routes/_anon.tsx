import { Outlet } from "@remix-run/react";
import { api } from "../api";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Page } from "@shopify/polaris";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { gadgetConfig } = context;

  if (gadgetConfig.shopifyInstallState) {
    const shop = await context.api.shopifyShop.findFirst({
      select: {
        myshopifyDomain: true,
      },
    });

    return redirect(
      `https://${shop?.myshopifyDomain}/admin/apps/${gadgetConfig.apiKeys.shopify}`
    );
  }

  return json({});
};

export default function () {
  return (
    <Page title="Leave a review">
      <Outlet />
    </Page>
  );
}

import { Outlet, useLoaderData } from "react-router";
import { NavMenu } from "../components/NavMenu";
import type { Route } from "./+types/_app"; 

export type OutletContext = {
  currency: string;
  bundleCount: number;
};

export const loader = async ({ context }: Route.LoaderArgs) => {
  const bundles = await context.api.bundle.findMany({
    first: 1,
    select: {
      id: true,
    },
  });

  return {
    gadgetConfig: context.gadgetConfig,
    shop: await context.api.shopifyShop.findFirst({
      select: {
        currency: true,
      },
    }),
    bundleCount: bundles.length,
  };
};

export default function() {
  const { gadgetConfig, shop, bundleCount } = useLoaderData<typeof loader>();

  return gadgetConfig.shopifyInstallState ? (
    <>
      <NavMenu />
      <Outlet
        context={{
          currency: shop?.currency ?? "",
          bundleCount,
        }}
      />
    </>
  ) : (
    <Unauthenticated />
  );
}

const Unauthenticated = () => {
  const { gadgetConfig } = useLoaderData<typeof loader>();

  return (
    <s-page inlineSize="base">
      <s-section>
        <s-box>
          <s-stack gap="small">
            <s-heading>App must be viewed in the Shopify Admin</s-heading>
            <div>
              <s-text>Edit this page: </s-text>
              <a href={`/edit/${gadgetConfig.environment}/files/web/routes/_app.tsx`}>web/routes/_app.tsx</a>
            </div>
          </s-stack>
        </s-box>
      </s-section>
    </s-page>
  );
};

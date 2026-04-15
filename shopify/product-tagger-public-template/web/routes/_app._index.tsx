import { useAction, useMaybeFindFirst, useSession } from "@gadgetinc/react";
import { AutoForm, AutoTable } from "@gadgetinc/react/auto/polaris-wc";
import { api } from "../api";

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return "Never";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const isCompleteState = (value: string | Record<string, unknown>) =>
  typeof value === "string" && value.trim().toLowerCase() === "completed";

export default function Index() {
  const session = useSession(api);
  const [{ data: lastSuccessfulSync, fetching: syncLoading, error: syncError }] = useMaybeFindFirst(api.shopifySync, {
    live: true,
    pause: !session.shopId,
    sort: {
      createdAt: "Descending",
    },
    filter: {
      state: {
        inState: "completed",
      },
    },
  });
  const [{ data: createdSync, fetching: syncRunning, error: runError }, runSync] = useAction(api.shopifySync.run);

  const lastSyncAt = lastSuccessfulSync?.updatedAt ?? lastSuccessfulSync?.createdAt;

  const handleRunSync = async () => {
    if (!session.shopId || syncRunning) return;

    await runSync({
      domain: shopify.config.shop,
      shop: {
        _link: session.shopId,
      },
    });
  };

  let bannerTone: "success" | "critical" | null = null;
  let bannerMessage: string | null = null;

  if (runError) {
    bannerTone = "critical";
    bannerMessage = `Couldn't start tagging existing products: ${runError.message}`;
  } else if (syncError) {
    bannerTone = "critical";
    bannerMessage = `Couldn't load the latest run: ${syncError.message}`;
  } else if (createdSync?.errorMessage) {
    bannerTone = "critical";
    bannerMessage = `Tagging failed: ${createdSync.errorMessage}`;
  } else if (createdSync?.state && isCompleteState(createdSync.state)) {
    bannerTone = "success";
    bannerMessage = `Finished tagging existing products on ${formatDateTime(createdSync.updatedAt ?? createdSync.createdAt)}.`;
  }

  return (
    <s-page heading="Product tagger">
      <s-section heading="Add keywords">
        {/* This form allows users to add new keywords */}
        <AutoForm title={false} action={api.allowedTag.create} />
      </s-section>
      <s-section heading="Keywords">
        {/* This table displays the allowed keywords for the Shopify product */}
        <AutoTable model={api.allowedTag} columns={["keyword"]} />
      </s-section>
      <s-section heading="Tag existing products">
        {/* This button kicks off a historical sync and tag against existing products */}
        <s-stack gap="base">
          {bannerTone && bannerMessage ? (
            <s-banner tone={bannerTone} dismissible>{bannerMessage}</s-banner>
          ) : null}
          <s-stack gap="small-100">
            <s-text>
              Use this only after adding new keywords and only if you want those keywords applied to products that already exist in Shopify. New and updated products will continue to be tagged automatically.
            </s-text>
            <s-text type="strong">
              {lastSyncAt ? `Last successful run: ${formatDateTime(lastSyncAt)}` : "Last successful run: Never"}
            </s-text>
          </s-stack>
          <s-button
            variant="primary"
            disabled={!session.shopId || syncRunning || syncLoading}
            onClick={handleRunSync}
          >
            {syncRunning ? "Starting re-tag..." : "Tag existing products"}
          </s-button>
        </s-stack>
      </s-section>
    </s-page>
  );
}

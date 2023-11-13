import { useAction, useFindMany } from "@gadgetinc/react";
import {
  Banner,
  BlockStack,
  Layout,
  Page,
  Text,
  Button,
} from "@shopify/polaris";
import { api } from "./api";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "@shopify/app-bridge-react";
import { trialCalculations } from "./utilities";
import { ShopContext } from "./providers";

const ShopPage = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");
  const { shop, availableTrialDays, prices } = useContext(ShopContext);

  const [
    {
      data: subscription,
      fetching: fetchingSubscription,
      error: errorSubscribing,
    },
    subscribe,
  ] = useAction(api.shopifyShop.subscribe, {
    select: {
      confirmationUrl: true,
    },
  });

  /**
   * @type { () => void }
   *
   * Callback used to subscribe to a plan and redirect to the Shopify subscription confirmation page
   */
  const handleSubscribe = useCallback(async () => {
    const res = await subscribe({ id: shop.id });

    if (res?.data?.confirmationUrl) {
      navigate(res.data.confirmationUrl);
    }
  }, [shop, subscribe]);

  /**
   * @type { () => void }
   *
   * Dismisses the error banner
   */
  const handleDismiss = useCallback(() => {
    setShow(false);
  }, []);

  // useEffect for showing an error banner when there's an issue subscribing
  useEffect(() => {
    if (!fetchingSubscription && errorSubscribing) {
      setBannerContext(errorSubscribing.message);
      setShow(true);
    } else if (fetchingSubscription) {
      setShow(false);
    }
  }, [fetchingSubscription, errorSubscribing]);

  return (
    <Page title="Plan Selection Page">
      <BlockStack gap="500">
        {show && (
          <Banner
            title={bannerContext}
            tone="critical"
            onDismiss={handleDismiss}
          />
        )}
        {shop?.plan?.id && (
          <Banner
            title={`This shop is assigned to the ${shop?.plan?.name} plan`}
            tone="success"
          >
            {availableTrialDays && (
              <Text as="p" variant="bodyMd">
                You have <strong>{availableTrialDays}</strong> trial days
                remaining.
              </Text>
            )}
          </Banner>
        )}
        <Layout>
          <Button onClick={handleSubscribe}>Click me</Button>
        </Layout>
      </BlockStack>
    </Page>
  );
};

export default ShopPage;

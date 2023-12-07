import { useAction, useFindFirst, useGlobalAction } from "@gadgetinc/react";
import {
  AlphaCard,
  Layout,
  Page,
  Select,
  Spinner,
  Text,
  VerticalStack,
  Button,
  Form,
  FormLayout,
} from "@shopify/polaris";
import { api } from "./api";
import SlackAuthButton from "./components/SlackAuthButton";
import { useState, useCallback, useEffect } from "react";

const ShopPage = () => {
  const [selected, setSelected] = useState("");

  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =
    useFindFirst(api.shopifyShop);
  const [
    {
      data: channels,
      fetching: fetchingChannels,
      error: errorFetchingChannels,
    },
    getChannels,
  ] = useGlobalAction(api.getChannels);
  const [_, setChannel] = useAction(api.shopifyShop.setChannel);

  const handleSelectChange = useCallback((value) => {
    console.log(value);
    setSelected(value);
  }, []);

  const handleSetChannel = useCallback(async (id, slackChannelId) => {
    await setChannel({ id, slackChannelId });
  }, []);

  useEffect(() => {
    if (shop && shop.slackAccessToken) {
      const run = async () => {
        await getChannels();
      };
      run();
    }
  }, [shop]);

  useEffect(() => {
    if (shop && shop.slackChannelId) {
      setSelected(shop.slackChannelId);
    }
  }, [shop]);

  if (errorFetchingShop) {
    return (
      <Page title="Error">
        <Text variant="bodyMd" as="p">
          Error: {error.toString()}
        </Text>
      </Page>
    );
  }

  if (fetchingShop) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }

  return (
    <Page title="Dashboard">
      <Layout sectioned>
        {shop.slackAccessToken ? (
          <>
            <Layout.Section>
              <AlphaCard>
                <VerticalStack gap="3">
                  <Text as="h2" variant="headingLg">
                    Choosing a channel
                  </Text>
                  <Text as="p" variant="bodyMd">
                    You must choose a channel on which notifications will be
                    displayed by the bot.
                  </Text>
                  <Form onSubmit={() => handleSetChannel(shop.id, selected)}>
                    <FormLayout>
                      <Select
                        label="Channel"
                        options={
                          channels || [{ label: "None selected", value: "" }]
                        }
                        onChange={handleSelectChange}
                        value={selected}
                      />
                      <Button submit>Set channel</Button>
                    </FormLayout>
                  </Form>
                </VerticalStack>
              </AlphaCard>
            </Layout.Section>
            <Layout.Section>
              <AlphaCard>
                <VerticalStack gap="3">
                  <Text as="h2" variant="headingLg">
                    Reauthenticating
                  </Text>
                  <Text as="p" variant="bodyMd">
                    You may wish to rerun the authentication flow at any time.
                    To do so click on the button below.
                  </Text>
                  <SlackAuthButton />
                </VerticalStack>
              </AlphaCard>
            </Layout.Section>
          </>
        ) : (
          <Layout.Section>
            <AlphaCard>
              <VerticalStack gap="3">
                <Text as="h2" variant="headingLg">
                  Connecting to Slack
                </Text>
                <Text as="p" variant="bodyMd">
                  To install the Slack bot on your Slack workspace, click the
                  button below.
                </Text>
                <SlackAuthButton />
              </VerticalStack>
            </AlphaCard>
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );
};

export default ShopPage;

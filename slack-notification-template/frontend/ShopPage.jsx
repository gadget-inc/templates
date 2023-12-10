import { useAction, useFindFirst, useGlobalAction } from "@gadgetinc/react";
import {
  Card,
  Layout,
  Page,
  Spinner,
  Text,
  BlockStack,
  Button,
  Form,
  FormLayout,
  Listbox,
  Combobox,
  Icon,
  Frame,
  Toast,
} from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";
import { api } from "./api";
import SlackAuthButton from "./components/SlackAuthButton";
import { useState, useCallback, useEffect, useMemo } from "react";

// TODO: ADD COMMENTS TO APP

const ShopPage = () => {
  const [
    {
      data: channels,
      fetching: fetchingChannels,
      error: errorFetchingChannels,
    },
    getChannels,
  ] = useGlobalAction(api.getChannels);

  const deselectedOptions = useMemo(
    () => channels || [{ label: "None", value: "" }],
    [channels]
  );
  const [selected, setSelected] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(deselectedOptions);
  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");
  const [active, setActive] = useState(false);

  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =
    useFindFirst(api.shopifyShop);

  const [
    { data: channelSet, error: errorSettingChannel, fetching: settingChannel },
    setSlackChannel,
  ] = useAction(api.shopifyShop.setSlackChannel);

  const handleSetSlackChannel = useCallback(async (id, slackChannelId) => {
    await setSlackChannel({ id, slackChannelId });
  }, []);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex)
      );
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const updateSelection = useCallback(
    (selected) => {
      const matchedOption = options.find((option) => {
        return option.value.match(selected);
      });

      setSelected(selected);
      setInputValue((matchedOption && matchedOption.label) || "");
    },
    [options]
  );

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  /**
   * @type { () => void }
   *
   * Dismisses the error banner
   */
  const handleDismiss = useCallback(() => {
    setShow(false);
  }, []);

  useEffect(() => {
    if (shop?.slackAccessToken) {
      const run = async () => {
        await getChannels();
      };
      run();
    }
  }, [shop]);

  useEffect(() => {
    if (shop?.slackChannelId) {
      setSelected(shop.slackChannelId);
    }
  }, [shop]);

  useEffect(() => {
    if (!fetchingChannels && channels) {
      setOptions(deselectedOptions);
    }
  }, [channels, fetchingChannels]);

  // useEffect for showing an error banner when there's an issue starting the purchase flow
  useEffect(() => {
    if (!fetchingShop && errorFetchingShop) {
      setBannerContext(errorFetchingShop.message);
      setShow(true);
    } else if (fetchingShop) {
      setShow(false);
    }
  }, [fetchingShop, errorFetchingShop]);

  // CHANGE THIS
  // useEffect for showing an error banner when there's an issue starting the purchase flow
  useEffect(() => {
    if (!fetchingChannels && errorFetchingChannels) {
      setBannerContext(errorFetchingChannels.message);
      setShow(true);
    } else if (fetchingChannels) {
      setShow(false);
    }
  }, [fetchingChannels, errorFetchingChannels]);

  // CHANGE THIS
  // useEffect for showing an error banner when there's an issue starting the purchase flow
  useEffect(() => {
    if (!settingChannel && errorSettingChannel) {
      setBannerContext(errorSettingChannel.message);
      setShow(true);
    } else if (settingChannel) {
      setShow(false);
    }
  }, [settingChannel, errorSettingChannel]);

  useEffect(() => {
    if (channelSet) {
      toggleActive();
    }
  }, [settingChannel, channelSet]);

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
    <>
      <Page>
        {show && (
          <Banner
            title={bannerContext}
            tone="critical"
            onDismiss={handleDismiss}
          />
        )}
      </Page>
      <Page title="Dashboard">
        <Layout sectioned>
          {shop.slackAccessToken ? (
            <>
              <Layout.Section>
                <Card>
                  <BlockStack gap="300">
                    <Text as="h2" variant="headingMd">
                      Choosing a channel
                    </Text>
                    <Text as="p" variant="bodyMd">
                      You must choose a channel on which notifications will be
                      displayed by the bot.
                    </Text>
                    <Form
                      onSubmit={() => handleSetSlackChannel(shop.id, selected)}
                    >
                      <FormLayout>
                        <Combobox
                          activator={
                            <Combobox.TextField
                              prefix={<Icon source={SearchMinor} />}
                              onChange={updateText}
                              label="Select a channel"
                              value={inputValue}
                              placeholder={
                                channels?.filter(
                                  (channel) =>
                                    channel.value === shop.slackChannelId
                                )[0].label || "Select a channel"
                              }
                              autoComplete="off"
                              disabled={fetchingChannels}
                            />
                          }
                        >
                          {options.length > 0 && (
                            <Listbox onSelect={updateSelection}>
                              {options.map((option) => (
                                <Listbox.Option
                                  key={`${option.value}`}
                                  value={option.value}
                                  selected={selected === option.value}
                                  accessibilityLabel={option.label}
                                >
                                  {option.label}
                                </Listbox.Option>
                              ))}
                            </Listbox>
                          )}
                        </Combobox>
                        <Button
                          submit
                          disabled={fetchingChannels || settingChannel}
                          loading={settingChannel}
                        >
                          Set channel
                        </Button>
                      </FormLayout>
                    </Form>
                  </BlockStack>
                </Card>
              </Layout.Section>
              <Layout.Section>
                <Card>
                  <BlockStack gap="300">
                    <Text as="h2" variant="headingMd">
                      Reauthenticating
                    </Text>
                    <Text as="p" variant="bodyMd">
                      You may wish to rerun the authentication flow at any time.
                      To do so click on the button below.
                    </Text>
                    <SlackAuthButton />
                  </BlockStack>
                </Card>
              </Layout.Section>
            </>
          ) : (
            <Layout.Section>
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Connecting to Slack
                  </Text>
                  <Text as="p" variant="bodyMd">
                    To install the Slack bot on your Slack workspace, click the
                    button below.
                  </Text>
                  <SlackAuthButton />
                </BlockStack>
              </Card>
            </Layout.Section>
          )}
        </Layout>
        <Frame>
          {active && (
            <Toast content="Slack channel selected" onDismiss={toggleActive} />
          )}
        </Frame>
      </Page>
    </>
  );
};

export default ShopPage;

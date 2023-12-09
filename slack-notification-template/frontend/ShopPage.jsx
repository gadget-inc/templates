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

  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =
    useFindFirst(api.shopifyShop);

  // TODO: ADD ERROR HANDLING FOR FAILURES TO SET CHANNEL (banner)
  const [
    { error: errorSettingChannel, fetching: settingChannel },
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
    </Page>
  );
};

export default ShopPage;

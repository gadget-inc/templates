import { useAction, useFindFirst, useGlobalAction } from "@gadgetinc/react";
import {
  Card,
  Layout,
  Page,
  Select,
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
    []
  );
  const [selectedOption, setSelectedOption] = useState();
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(deselectedOptions);

  // ^^^^ From the Combobox docs

  const [selected, setSelected] = useState("");

  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =
    useFindFirst(api.shopifyShop);

  // TODO: ADD ERROR HANDLING FOR FAILURES TO SET CHANNEL (banner)
  const [{ error: errorSettingChannel, fetching: settingChannel }, setChannel] =
    useAction(api.shopifyShop.setChannel);

  const handleSelectChange = useCallback((value) => {
    setSelected(value);
  }, []);

  const handleSetChannel = useCallback(async (id, slackChannelId) => {
    await setChannel({ id, slackChannelId });
  }, []);

  const updateText = useCallback(
    (value) => {
      // string
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
      // string
      const matchedOption = options.find((option) => {
        return option.value.match(selected);
      });

      setSelectedOption(selected);
      setInputValue((matchedOption && matchedOption.label) || "");
    },
    [options]
  );

  const optionsMarkup =
    options.length > 0
      ? options.map((option) => {
          const { label, value } = option;

          return (
            <Listbox.Option
              key={`${value}`}
              value={value}
              selected={selectedOption === value}
              accessibilityLabel={label}
            >
              {label}
            </Listbox.Option>
          );
        })
      : null;

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

  // useEffect(() => {
  //   if (!fetchingChannels && channels) {
  //     setDeselectedOption(channels);
  //   }
  // }, [channels, fetchingChannels]);

  // Use effect for setting deselectedCOptions?

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
                  <Form onSubmit={() => handleSetChannel(shop.id, selected)}>
                    <FormLayout>
                      <Combobox
                        activator={
                          <Combobox.TextField
                            prefix={<Icon source={SearchMinor} />}
                            onChange={updateText}
                            label="Search tags"
                            labelHidden
                            value={inputValue}
                            placeholder="Search tags"
                            autoComplete="off"
                          />
                        }
                      >
                        {options.length > 0 ? (
                          <Listbox onSelect={updateSelection}>
                            {optionsMarkup}
                          </Listbox>
                        ) : null}
                      </Combobox>
                      {/* Try to change this to the combobox  */}
                      {/* <Select
                        label="Channel"
                        options={
                          channels || [{ label: "None selected", value: "" }]
                        }
                        onChange={handleSelectChange}
                        value={selected}
                      /> */}
                      <Button submit>Set channel</Button>
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

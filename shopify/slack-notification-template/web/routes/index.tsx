import {
  Controller,
  useActionForm,
  useFindFirst,
  useGlobalAction,
} from "@gadgetinc/react";
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
  Banner,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { api } from "../api";
import { SlackAuthButton } from "../components";
import { useState, useCallback, useEffect, useMemo } from "react";
import { GadgetRecord } from "@gadget-client/slack-notification-template";

type Channel = {
  label: string;
  value: string;
};

const SlackChannelSelectionForm = ({
  shop,
  setShow,
  setBannerContext,
  toggleActive,
}: {
  shop: GadgetRecord<{
    id: string;
    slackChannelId: string | null;
    hasSlackAccessToken: boolean;
  }>;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setBannerContext: React.Dispatch<React.SetStateAction<string>>;
  toggleActive: () => void;
}) => {
  const {
    submit,
    control,
    error: errorSettingChannel,
    formState,
  } = useActionForm(api.shopifyShop.setSlackChannel, {
    findBy: shop.id,
    select: {
      id: true,
      slackChannelId: true,
    },
  });

  const [
    {
      data: channels,
      fetching: fetchingChannels,
      error: errorFetchingChannels,
    },
    getChannels,
  ] = useGlobalAction(api.getChannels);

  const deselectedOptions: Channel[] = useMemo(
    () => channels || [{ label: "None selected", value: "" }],
    [channels]
  );

  const [options, setOptions] = useState(deselectedOptions);
  const [inputValue, setInputValue] = useState("");

  // Handler for updating the options available in the combobox dropdown
  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(new RegExp(value, "i"))
      );
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  // useEffect for fetching a list of Slack channels if there's a slackAccessToken on the shop
  useEffect(() => {
    if (shop?.hasSlackAccessToken) {
      const run = async () => {
        await getChannels();
      };
      run();
    }
  }, []);

  // useEffect for showing an error banner when there's an issue setting a new Slack channel
  useEffect(() => {
    if (!formState.isSubmitting && errorSettingChannel) {
      setBannerContext(errorSettingChannel.message);
      setShow(true);
    } else if (formState.isSubmitting) {
      setShow(false);
    }
  }, [formState.isSubmitting, errorSettingChannel]);

  // useEffect for showing an error banner when there's an issue fetching all Slack channels
  useEffect(() => {
    if (!fetchingChannels && errorFetchingChannels) {
      setBannerContext(errorFetchingChannels.message);
      setShow(true);
    } else if (fetchingChannels) {
      setShow(false);
    }
  }, [fetchingChannels, errorFetchingChannels]);

  // useEffect for setting the options once the channels have been returned from the backend
  useEffect(() => {
    if (!fetchingChannels && channels) {
      setOptions(deselectedOptions);
    }
  }, [channels, fetchingChannels]);

  // useEffect for toggling the success toast if the setSlackChannel action is successful
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      toggleActive();
    }
  }, [formState.isSubmitSuccessful]);

  return (
    <>
      <Form onSubmit={submit}>
        <FormLayout>
          <Controller
            name="shopifyShop.slackChannelId"
            control={control}
            render={({ field }) => {
              const { ref, ...fieldProps } = field;
              return (
                <Combobox
                  activator={
                    <Combobox.TextField
                      prefix={<Icon source={SearchIcon} />}
                      onChange={updateText}
                      label="Select a channel"
                      value={inputValue}
                      placeholder={
                        (channels as Channel[])?.filter(
                          (channel) => channel.value === fieldProps.value
                        )[0]?.label || "Select a channel"
                      }
                      autoComplete="off"
                      disabled={fetchingChannels || formState.isSubmitting}
                    />
                  }
                >
                  {options?.length > 0 ? (
                    <Listbox
                      onSelect={(value) => {
                        setInputValue(
                          (channels as Channel[])?.filter(
                            (channel) => channel.value === value
                          )[0].label as string
                        );
                        fieldProps.onChange(value);
                      }}
                    >
                      {options.map((option) => (
                        <Listbox.Option
                          key={`${option.value}`}
                          value={option.value}
                          selected={fieldProps.value === option.value}
                          accessibilityLabel={option.label}
                        >
                          {option.label}
                        </Listbox.Option>
                      ))}
                    </Listbox>
                  ) : null}
                </Combobox>
              );
            }}
          />
          <Button
            submit
            disabled={fetchingChannels || formState.isSubmitting}
            loading={formState.isSubmitting}
          >
            Set channel
          </Button>
        </FormLayout>
      </Form>
    </>
  );
};

const ShopPage = () => {
  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");
  const [active, setActive] = useState(false);

  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =
    useFindFirst(api.shopifyShop, {
      select: {
        id: true,
        hasSlackAccessToken: true,
        slackChannelId: true,
      },
    });

  //  Handler for dismissing the error banner
  const handleDismiss = useCallback(() => {
    setShow(false);
  }, []);

  // Handler for toggling the channel set success toast
  const toggleActive = useCallback(() => setActive((prev) => !prev), []);

  // useEffect for showing an error banner when there's an issue fetching the current Shopify shop
  useEffect(() => {
    if (!fetchingShop && errorFetchingShop) {
      setBannerContext(errorFetchingShop.message);
      setShow(true);
    } else if (fetchingShop) {
      setShow(false);
    }
  }, [fetchingShop, errorFetchingShop]);

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
          {shop?.hasSlackAccessToken ? (
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
                    <SlackChannelSelectionForm
                      shop={shop}
                      setShow={setShow}
                      setBannerContext={setBannerContext}
                      toggleActive={toggleActive}
                    />
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
                    <SlackAuthButton reauth />
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
      <Frame>
        {active && (
          <Toast content="Slack channel changed" onDismiss={toggleActive} />
        )}
      </Frame>
    </>
  );
};

export default ShopPage;

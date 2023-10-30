import { useAction, useGlobalAction } from "@gadgetinc/react";
import {
  Card,
  Layout,
  Page,
  Select,
  Text,
  BlockStack,
  Button,
  Form,
  FormLayout,
} from "@shopify/polaris";
import { api } from "./api";
import SlackAuthButton from "./components/SlackAuthButton";
import { useState, useCallback, useEffect } from "react";

/**
 * @param { { shopId: string, slackAccessToken: string | null | undefined, slackChannelId: string | null | undefined  } } props The props passed to the React functional component
 *
 * @returns { import("react").ReactElement } A React functional component
 */
export default ({ shopId, slackAccessToken, slackChannelId }) => {
  const [selected, setSelected] = useState("");

  const [
    {
      data: channels,
      fetching: fetchingChannels,
      error: errorFetchingChannels,
    },
    getChannels,
  ] = useGlobalAction(api.getChannels);

  const [_, setSlackChannel] = useAction(api.shopifyShop.setSlackChannel);

  /**
   * @type { (value: string) => void }
   * Callback for handling a change to the selected Slack channel
   */
  const handleSelectChange = useCallback((value) => {
    setSelected(value);
  }, []);

  /**
   * @type { (id: string, slackChannelId: string ) => void }
   * Callback that sets the current channel id in the backend (decides where to send notifications)
   */
  const handleSetChannel = useCallback(async (id, slackChannelId) => {
    await setSlackChannel({ id, slackChannelId });
  }, []);

  // Gets Slack channels on component load
  useEffect(() => {
    if (slackAccessToken) {
      const run = async () => {
        await getChannels();
      };
      run();
    }
  }, [slackAccessToken]);

  // Sets the shop's current Slakc channel as the selected channel
  useEffect(() => {
    if (slackChannelId) {
      setSelected(slackChannelId);
    }
  }, [slackChannelId]);

  return (
    <Page title="Slack Notifications">
      <Layout sectioned>
        {slackAccessToken ? (
          <>
            <Layout.Section>
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingLg">
                    Choosing a channel
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Before recieving notifications on your Slack workspace, you
                    must choose a channel on which notifications will be
                    displayed.
                  </Text>
                  <Form onSubmit={() => handleSetChannel(shopId, selected)}>
                    <FormLayout>
                      <Select
                        label="Channel"
                        options={
                          channels || [{ label: "None selected", value: "" }]
                        }
                        onChange={handleSelectChange}
                        value={selected}
                      />
                      <Button
                        submit
                        disabled={fetchingChannels}
                        loading={fetchingChannels}
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
                  <Text as="h2" variant="headingLg">
                    Reauthenticating
                  </Text>
                  <Text as="p" variant="bodyMd">
                    You may wish to rerun the authentication flow at any time.
                    To do so click on the button below.
                  </Text>
                  <SlackAuthButton reauthenticate />
                </BlockStack>
              </Card>
            </Layout.Section>
          </>
        ) : (
          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingLg">
                  Connect to Slack
                </Text>
                <Text as="p" variant="bodyMd">
                  To receive notifications in Slack you must first install our
                  Slack bot on your Slack workspace. To install the Slack bot,
                  click the button below.
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

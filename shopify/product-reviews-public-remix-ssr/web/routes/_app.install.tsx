import { json, type ActionFunctionArgs } from "@remix-run/node";
import {
  getAggregatedEnabledOn,
  getBlockDetails,
} from "../lib/utils/theme/index";
import { determineShopThemeVersion } from "gadget-server/shopify";
import { useLoaderData } from "@remix-run/react";
import {
  BlockStack,
  Card,
  InlineStack,
  Layout,
  List,
  Page,
  Select,
  Text,
} from "@shopify/polaris";
import type { Block } from "../lib/utils/theme/types";
import { Modal } from "@shopify/app-bridge-react";
import { useState } from "react";
import Assets from "../components/theme/Assets";
import BlockList from "../components/theme/Block";

export async function loader({ context }: ActionFunctionArgs) {
  const shopify = context.connections.shopify.current;

  if (!shopify) throw new Error("Not accessing from the Shopify app");

  const themeVersions = await determineShopThemeVersion(
    shopify,
    await getAggregatedEnabledOn()
  );

  return json({ blocks: await getBlockDetails(themeVersions), themeVersions });
}

function InstallGuide(props: { block: Block | null }) {
  const { block } = props;
  const { themeVersions } = useLoaderData<typeof loader>();
  const multipleTemplates =
    (block?.enabledOn?.length || 0) > 1 || block?.enabledOn?.includes("*");

  const [template, setTemplate] = useState<string>("");

  return (
    <BlockStack gap="400">
      {multipleTemplates && (
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Choose a template
            </Text>
            <Text as="p" variant="bodyMd">
              Select the template where you want to embed your extension. We'll
              check your theme type and show you the right setup steps.
            </Text>
            <InlineStack align="start">
              <div style={{ width: "50%" }}>
                <Select
                  label="Template"
                  placeholder="Select a template"
                  options={themeVersions
                    .filter(
                      (version) =>
                        block?.enabledOn?.includes("*") ||
                        block?.enabledOn?.includes(version.pageType)
                    )
                    .map((version) => ({
                      label: version.pageType,
                      value: version.pageType,
                    }))}
                  onChange={(value) => setTemplate(value)}
                  value={template}
                />
              </div>
            </InlineStack>
          </BlockStack>
        </Card>
      )}
      {multipleTemplates && !template && (
        <Card>
          <BlockStack gap="200" align="center" inlineAlign="center">
            <Text as="h2" variant="headingMd" fontWeight="bold">
              No template selected
            </Text>
            <Text as="p" variant="bodyMd">
              Choose a template from the list to see the setup guide.
            </Text>
          </BlockStack>
        </Card>
      )}
      {(!multipleTemplates || template) && (
        <Card>
          <Text as="h2" variant="headingMd">
            Setup guide
          </Text>
          <Text as="p" variant="bodyMd">
            Follow these steps to install the extension:
          </Text>
          <List type="number">
            <List.Item>
              <Text as="p" variant="bodyMd">
                asd
              </Text>
            </List.Item>
            <Assets assets={block?.assets || []} />
          </List>
        </Card>
      )}
    </BlockStack>
  );
}

export default function () {
  const { blocks } = useLoaderData<typeof loader>();

  const [block, setBlock] = useState<Block | null>(null);

  return (
    <Page>
      <Layout>
        <Layout.Section>
          {blocks.length > 1 ? (
            <BlockList {...{ setBlock }} />
          ) : (
            <InstallGuide block={blocks[0]} />
          )}
        </Layout.Section>
      </Layout>
      <Modal id="extension-installation-modal">
        <InstallGuide {...{ block }} />
      </Modal>
    </Page>
  );
}

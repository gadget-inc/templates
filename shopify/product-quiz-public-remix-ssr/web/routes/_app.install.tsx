import { json, type ActionFunctionArgs } from "@remix-run/node";
import {
  getAggregatedEnabledOn,
  getBlockDetails,
} from "../lib/utils/theme/index";
import { determineShopThemeVersion } from "gadget-server/shopify";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  BlockStack,
  Card,
  FooterHelp,
  InlineStack,
  Layout,
  Link,
  List,
  Page,
  Select,
  Text,
} from "@shopify/polaris";
import type { Block } from "../lib/utils/theme/types";
import { Modal } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useState } from "react";
import Assets from "../components/theme/Assets";
import BlockList from "../components/theme/Block";
import CodeBlock from "../components/theme/CodeBlock";
import ThreeDots from "../components/assets/svgs/ThreeDots";

// Utility function to process liquid content for display
function processLiquidContent(content: string): string {
  return (
    content
      // Remove the "target" line from the schema section
      .replace(/(\s*"target"\s*:\s*"[^"]*",?\s*)/g, "\n\t")
      // Replace all instances of "block." with "section."
      .replace(/block\./g, "section.")
  );
}

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
  const navigate = useNavigate();

  const [template, setTemplate] = useState<string>("");

  // Determine the theme version for the selected template
  const getSelectedThemeVersion = useCallback(() => {
    if (!template) return null;
    const selectedVersion = themeVersions.find(
      (version) => version.pageType === template
    );
    return selectedVersion?.version || null;
  }, [template, themeVersions]);

  const selectedThemeVersion = getSelectedThemeVersion();

  useEffect(() => {
    if (!multipleTemplates && block?.enabledOn?.[0]) {
      setTemplate(block.enabledOn[0]);
    }
  }, [multipleTemplates, block?.enabledOn]);

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
      {template && (
        <Card>
          <BlockStack gap="300">
            <Text as="p" variant="bodyMd">
              Follow these steps to install the extension:
            </Text>
            <List type="number" gap="loose">
              <List.Item>
                <Text as="span" variant="bodyMd">
                  Start by{" "}
                  <Link onClick={() => navigate("/quiz")}>creating a quiz</Link>{" "}
                  on the app admin ui
                </Text>
              </List.Item>
              {/* The two first steps are the same for all theme versions */}
              <List.Item>
                <Text as="span" variant="bodyMd">
                  Go to <strong>Online store {">"} Themes</strong>.{" "}
                  {selectedThemeVersion === "v1" ? (
                    <>
                      Find your theme and click on{" "}
                      <ThreeDots
                        style={{
                          verticalAlign: "middle",
                          display: "inline-block",
                        }}
                      />{" "}
                      and select <strong>Edit code</strong>
                    </>
                  ) : (
                    <>
                      Next to your current theme, click{" "}
                      <strong>Customize</strong>
                    </>
                  )}
                  .
                </Text>
              </List.Item>
              {selectedThemeVersion === "v1" ? (
                <>
                  <List.Item>
                    <BlockStack gap="200">
                      <Text as="span" variant="bodyMd">
                        Create a file in the <strong>sections</strong> folder
                        called{" "}
                        <strong>
                          {block?.name.toLocaleLowerCase()}.liquid
                        </strong>{" "}
                        and paste in the following snippet:
                      </Text>
                      <CodeBlock
                        title={`${block?.name.toLocaleLowerCase()}.liquid`}
                        language="liquid"
                      >
                        {block?.content
                          ? processLiquidContent(block.content)
                          : ""}
                      </CodeBlock>
                    </BlockStack>
                  </List.Item>
                  <Assets assets={block?.assets || []} />
                  {/* The rest are template specific steps */}
                  <List.Item>
                    <BlockStack gap="200">
                      <Text as="span" variant="bodyMd">
                        Add the following snippet where you want the app to
                        appear
                      </Text>
                      <CodeBlock title="app invocation">
                        {`{%section "${block?.name}"%}`}
                      </CodeBlock>
                    </BlockStack>
                  </List.Item>
                  <List.Item>
                    <Text as="span" variant="bodyMd">
                      Save changes and return to the Shopify admin
                    </Text>
                  </List.Item>
                </>
              ) : (
                <>
                  <List.Item>
                    <Text as="span" variant="bodyMd">
                      In the theme editor, use the top dropdown to select the{" "}
                      <strong>
                        {template.charAt(0).toUpperCase() + template.slice(1)}
                      </strong>{" "}
                      template.
                    </Text>
                  </List.Item>
                  <List.Item>
                    <Text as="span" variant="bodyMd">
                      Add a section or block to your template, and select{" "}
                      <strong>{block?.name}</strong> under the apps tab.
                    </Text>
                  </List.Item>
                </>
              )}
              <List.Item>
                <Text as="span" variant="bodyMd">
                  To add your quiz go to{" "}
                  <strong>
                    Online store {">"} Theme {">"} Customize
                  </strong>
                  . Go to the template where your extension is invoked and paste
                  in your
                  <strong>Quiz ID</strong> on the settings panel.
                </Text>
              </List.Item>
            </List>
          </BlockStack>
        </Card>
      )}
    </BlockStack>
  );
}

export default function () {
  const { blocks } = useLoaderData<typeof loader>();

  const [block, setBlock] = useState<Block | null>(null);

  return (
    <Page title="Installation guide">
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
      <FooterHelp></FooterHelp>
    </Page>
  );
}

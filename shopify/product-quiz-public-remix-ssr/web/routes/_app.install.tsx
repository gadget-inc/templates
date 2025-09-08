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

function ThreeDots({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      style={style}
    >
      <path
        d="M6.97913 10C6.97913 10.3978 6.82109 10.7794 6.53979 11.0607C6.25848 11.342 5.87695 11.5 5.47913 11.5C5.0813 11.5 4.69977 11.342 4.41847 11.0607C4.13716 10.7794 3.97913 10.3978 3.97913 10C3.97913 9.60218 4.13716 9.22064 4.41847 8.93934C4.69977 8.65804 5.0813 8.5 5.47913 8.5C5.87695 8.5 6.25848 8.65804 6.53979 8.93934C6.82109 9.22064 6.97913 9.60218 6.97913 10Z"
        fill="black"
      />
      <path
        d="M12.4791 10C12.4791 10.3978 12.3211 10.7794 12.0398 11.0607C11.7585 11.342 11.377 11.5 10.9791 11.5C10.5813 11.5 10.1998 11.342 9.91847 11.0607C9.63716 10.7794 9.47913 10.3978 9.47913 10C9.47913 9.60218 9.63716 9.22064 9.91847 8.93934C10.1998 8.65804 10.5813 8.5 10.9791 8.5C11.377 8.5 11.7585 8.65804 12.0398 8.93934C12.3211 9.22064 12.4791 9.60218 12.4791 10Z"
        fill="black"
      />
      <path
        d="M17.9791 10C17.9791 10.3978 17.8211 10.7794 17.5398 11.0607C17.2585 11.342 16.877 11.5 16.4791 11.5C16.0813 11.5 15.6998 11.342 15.4185 11.0607C15.1372 10.7794 14.9791 10.3978 14.9791 10C14.9791 9.60218 15.1372 9.22064 15.4185 8.93934C15.6998 8.65804 16.0813 8.5 16.4791 8.5C16.877 8.5 17.2585 8.65804 17.5398 8.93934C17.8211 9.22064 17.9791 9.60218 17.9791 10Z"
        fill="black"
      />
    </svg>
  );
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
                  {selectedThemeVersion == "v1" ? (
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
                        {`{%section "${block?.name.toLocaleLowerCase()}"%}`}
                      </CodeBlock>
                    </BlockStack>
                  </List.Item>
                  <List.Item>
                    <Text as="span" variant="bodyMd">
                      Save changes and return to the Shopify admin
                    </Text>
                  </List.Item>
                  {/* Below is an extra step specific to this theme app extension */}
                  <List.Item>
                    <Text as="span" variant="bodyMd">
                      To add your quiz go to{" "}
                      <strong>
                        Online store {">"} Theme {">"} Customize
                      </strong>
                      . Go to the template where your app is invoked and paste
                      in your <strong>Quiz ID</strong> on the settings panel.
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

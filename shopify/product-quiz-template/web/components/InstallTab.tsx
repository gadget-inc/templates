import {
  Spinner,
  Select,
  Text,
  BlockStack,
  Badge,
  Button,
} from "@shopify/polaris";
import { useFindFirst } from "@gadgetinc/react";
import { api } from "../api";
import { useCallback } from "react";
import { useState } from "react";
import { default as Store1Instructions } from "./Store1Instructions";
import store2Install from "../assets/store2Install.webm";

export default () => {
  const [selected, setSelected] = useState<string>("Select");

  const handleSelectChange = useCallback(
    (value: string) => setSelected(value),
    []
  );

  const [storeResponse] = useFindFirst(api.shopifyShop, {
    select: {
      id: true,
      domain: true,
      themes: {
        edges: {
          node: {
            id: true,
            role: true,
            name: true,
            usingOnlineStore2: true,
          },
        },
      },
    },
  });

  if (storeResponse.fetching) return <Spinner />;

  const themes = storeResponse?.data?.themes.edges;
  const themeSelections = themes?.map((theme) => ({
    label:
      theme.node.role === "main"
        ? `${theme.node.name} (Live)`
        : theme.node.name ?? "",
    value: theme.node.id,
  }));
  const selectedIsShop2 = themes?.find((theme) => theme.node.id === selected)
    ?.node.usingOnlineStore2;

  return (
    <BlockStack gap="500">
      <Select
        label="Select a theme"
        options={["Select", ...(themeSelections || [])]}
        value={selected}
        onChange={handleSelectChange}
      />

      {selected !== "Select" && (
        <>
          <Text variant="headingMd" as="h6">
            Instructions{" "}
            <Badge tone="info">{`Online Store ${
              selectedIsShop2 ? "2.0" : "1.0"
            }`}</Badge>
          </Text>

          {selectedIsShop2 ? (
            <BlockStack gap="300">
              <video muted autoPlay loop>
                {" "}
                <source src={store2Install} type="video/webm" />
              </video>

              <Button
                target="_blank"
                url={`https://${storeResponse?.data?.domain}/admin/themes/${selected}/editor?addAppBlockId=${process.env["GADGET_PUBLIC_SHOPIFY_THEME_EXTENSION_ID"]}/quiz-page&target=newAppsSection`}
              >
                Preview in theme
              </Button>
            </BlockStack>
          ) : (
            <Store1Instructions />
          )}
        </>
      )}
    </BlockStack>
  );
};

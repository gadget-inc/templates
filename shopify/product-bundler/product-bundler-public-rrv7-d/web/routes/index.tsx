import { BlockStack, Layout, TextField } from "@shopify/polaris";
import { api } from "../api";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { useDebounce } from "use-debounce";
import { useFindMany } from "@gadgetinc/react";
import type { OutletContext } from "../components/App";
import PageLayout from "../components/PageLayout";
import { FullPageSpinner } from "../components/FullPageSpinner";
import BundleCard from "../components/BundleCard";

const NUM_ON_PAGE = 5;

export default function Index() {
  const { bundleCount, fetchingShop } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  const [cursor, setCursor] = useState<{
    first?: number;
    last?: number;
    before?: string;
    after?: string;
  }>({ first: NUM_ON_PAGE });
  const [searchValue, setSearchValue] = useState("");
  // Debounce for the input of the bundle search bar
  const [filter] = useDebounce(
    searchValue
      ? {
          filter: {
            titleLowercase: {
              startsWith: searchValue.toLowerCase(),
            },
          },
        }
      : null,
    500
  );

  const [
    { data: bundles, fetching: fetchingBundles, error: errorFetchingBundles },
  ] = useFindMany(api.bundle, {
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      price: true,
      bundleComponentCount: true,
      bundleComponents: {
        edges: {
          node: {
            quantity: true,
            productVariant: {
              id: true,
              title: true,
              price: true,
              product: {
                id: true,
                title: true,
                media: {
                  edges: {
                    node: {
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    ...cursor,
    ...filter,
  });

  // Pagination function for going to the previous page
  const getPreviousPage = useCallback(() => {
    setCursor({ last: NUM_ON_PAGE, before: bundles?.startCursor });
  }, [bundles]);

  // Pagination function for going to the next page
  const getNextPage = useCallback(() => {
    setCursor({ first: NUM_ON_PAGE, after: bundles?.endCursor });
  }, [bundles]);

  // Handler for the search bar input change
  const handleSearchInputChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  // Redirects to the create bundle page if the shop has no bundles
  useEffect(() => {
    if (!bundleCount && !fetchingShop) {
      navigate("/bundle");
    }
  }, [bundleCount, fetchingShop]);

  if (fetchingBundles) {
    return <FullPageSpinner />;
  }

  return (
    <PageLayout
      titleMetadata={
        <TextField
          label
          value={searchValue}
          placeholder="Search"
          clearButton
          onClearButtonClick={() => handleSearchInputChange("")}
          onChange={handleSearchInputChange}
          autoComplete="off"
        />
      }
      pagination={{
        hasPrevious: bundles?.hasPreviousPage,
        hasNext: bundles?.hasNextPage,
        onNext: getNextPage,
        onPrevious: getPreviousPage,
      }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {bundles?.map((bundle) => (
              <BundleCard key={bundle.id} {...bundle} />
            ))}
          </BlockStack>
        </Layout.Section>
      </Layout>
    </PageLayout>
  );
}

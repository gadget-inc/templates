import { BlockStack } from "@shopify/polaris";
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";
import { useCallback, useEffect, useState } from "react";
import { BundleCard, PageTemplate, Spinner } from "../components";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";

const NUM_ON_PAGE = 5;

export default () => {
  const navigate = useNavigate();
  const [cursor, setCursor] = useState({ first: NUM_ON_PAGE });
  const [searchValue, setSearchValue] = useState("");
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
      productVariants: {
        edges: {
          node: {
            title: true,
            product: {
              title: true,
              images: {
                edges: {
                  node: {
                    source: true,
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

  const getPreviousPage = useCallback(() => {
    setCursor({ last: NUM_ON_PAGE, before: bundles?.startCursor });
  }, [bundles]);

  const getNextPage = useCallback(() => {
    setCursor({ first: NUM_ON_PAGE, after: bundles?.endCursor });
  }, [bundles]);

  const handleSearchInputChange = useCallback((value) => {
    setSearchValue(value);
  }, []);

  useEffect(() => {
    if (!fetchingBundles && errorFetchingBundles) {
      console.error(errorFetchingBundles);
    }
  }, [fetchingBundles, errorFetchingBundles]);

  return (
    <PageTemplate
      title={"Bundles"}
      {...{
        handleSearchInputChange,
        searchValue,
        getNextPage,
        getPreviousPage,
      }}
      hasNextPage={bundles?.hasNextPage || false}
      hasPreviousPage={bundles?.hasPreviousPage || false}
    >
      <BlockStack gap="500">
        {!fetchingBundles ? (
          bundles?.map((bundle, key) => <BundleCard key={key} {...bundle} />)
        ) : (
          <Spinner />
        )}
      </BlockStack>
    </PageTemplate>
  );
};
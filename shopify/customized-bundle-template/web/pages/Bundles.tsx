import { BlockStack } from "@shopify/polaris";
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { BundleCard, PageTemplate, Spinner } from "../components";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { ShopContext } from "../providers";
import { ShopContextType } from "../providers/ShopProvider";
import {
  Bundle,
  BundleComponent,
} from "@gadget-client/customized-bundle-template";

const NUM_ON_PAGE = 5;

export default () => {
  const navigate = useNavigate();
  const { shop }: { shop?: ShopContextType } = useContext(ShopContext);

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

  // Error handling for fetching bundles (only logs at the moment)
  useEffect(() => {
    if (!fetchingBundles && errorFetchingBundles) {
      console.error(errorFetchingBundles);
    }
  }, [fetchingBundles, errorFetchingBundles]);

  // Redirects to the create bundle page if the shop has no bundles
  useEffect(() => {
    if (!shop?.bundleCount) {
      navigate("/create-bundle");
    }
  }, [shop?.bundleCount]);

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
          bundles?.map((bundle, key) => (
            <BundleCard
              key={key}
              id={bundle.id}
              title={bundle.title}
              description={bundle.description}
              status={bundle.status}
              price={bundle.price}
              bundleComponentCount={bundle.bundleComponentCount as number}
              bundleComponents={bundle.bundleComponents}
            />
          ))
        ) : (
          <Spinner />
        )}
      </BlockStack>
    </PageTemplate>
  );
};

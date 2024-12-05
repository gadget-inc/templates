import {
  BlockStack,
  Button,
  Page,
  reactExtension,
  useApi,
} from "@shopify/ui-extensions-react/customer-account";
import { Provider, useGadget } from "@gadgetinc/shopify-extensions/react";
import { api } from "./api";
import { useFindMany } from "@gadgetinc/react";
import { useEffect } from "react";
import { NewWishlist, StyledSpinner, WishlistCard } from "./components";
import { ShopProvider } from "./providers";

export default reactExtension("customer-account.page.render", () => <App />);

function App() {
  const { sessionToken } = useApi();

  return (
    <Provider api={api} sessionToken={sessionToken}>
      <FullPageExtension />
    </Provider>
  );
}

function FullPageExtension() {
  const { ready } = useGadget();

  // Fetching wishlists for the current shop (add pagination like in WishlistModal.jsx if needed)
  const [
    {
      data: wishlists,
      fetching: fetchingWishlists,
      error: errorFetchingWishlists,
    },
  ] = useFindMany(api.wishlist, {
    select: {
      id: true,
      name: true,
      itemCount: true,
      image: {
        url: true,
      },
    },
    live: true,
    pause: !ready,
  });

  useEffect(() => {
    if (!fetchingWishlists && errorFetchingWishlists) {
      console.error("Error fetching wishlists", errorFetchingWishlists);
    }
  }, [errorFetchingWishlists, fetchingWishlists]);

  if (fetchingWishlists) {
    return <StyledSpinner />;
  }

  return (
    <ShopProvider>
      <Page
        title="Wishlists"
        primaryAction={
          <Button overlay={<NewWishlist wishlists={wishlists} />}>New</Button>
        }
      >
        <BlockStack>
          {wishlists?.map(({ id, name, itemCount, image }) =>
            image ? (
              <WishlistCard
                key={id}
                {...{
                  id,
                  name,
                  image,
                  itemCount: itemCount as number,
                }}
              />
            ) : null
          )}
        </BlockStack>
      </Page>
    </ShopProvider>
  );
}

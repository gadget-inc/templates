import {
  reactExtension,
  Text,
  Page,
  Grid,
  useApi,
  Button,
  Card,
  BlockStack,
  Heading,
} from "@shopify/ui-extensions-react/customer-account";
import { Provider, useGadget } from "@gadgetinc/shopify-extensions/react";
import { useFindMany } from "@gadgetinc/react";
import { api } from "./api";
import WishlistCard from "./components/cards/Wishlist";
import StyledSpinner from "./components/StyledSpinner";
import ShopProvider from "./providers/Shop";
import Create from "./components/modals/Create";

export default reactExtension("customer-account.page.render", () => <Render />);

function Render() {
  const { sessionToken } = useApi();

  return (
    <Provider api={api} sessionToken={sessionToken}>
      <ShopProvider>
        <Wishlists />
      </ShopProvider>
    </Provider>
  );
}

function Wishlists() {
  const { ready } = useGadget();

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
      image: {
        url: true,
      },
      itemCount: true,
    },
    pause: !ready,
    live: true,
  });

  if (fetchingWishlists) {
    return <StyledSpinner />;
  }

  if (errorFetchingWishlists) {
    return <Text>Error fetching wishlists</Text>;
  }

  return (
    <Page
      title="Wishlists"
      primaryAction={
        <Button overlay={<Create wishlists={wishlists} />}>New</Button>
      }
    >
      {wishlists?.length ? (
        <Grid
          columns={["fill", "fill"]}
          rows="auto"
          spacing="base"
          blockAlignment="start"
        >
          {wishlists?.map((item) => <WishlistCard {...item} key={item.id} />)}
        </Grid>
      ) : (
        <Card padding>
          <BlockStack spacing="base" inlineAlignment="center">
            <Heading level={2}>No wishlists yet</Heading>
            <Text appearance="subdued" size="medium">
              Create your first wishlist to start saving your favorite items
            </Text>
            <Button overlay={<Create wishlists={wishlists} />}>
              Create your first wishlist
            </Button>
          </BlockStack>
        </Card>
      )}
    </Page>
  );
}

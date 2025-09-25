import {
  reactExtension,
  Text,
  BlockStack,
  ResourceItem,
  Page,
  Grid,
  GridItem,
  useApi,
} from "@shopify/ui-extensions-react/customer-account";
import { Provider, useGadget } from "@gadgetinc/shopify-extensions/react";
import { useFindMany } from "@gadgetinc/react";
import { api } from "./api";
import StyledSpinner from "./components/StyledSpinner";

export default reactExtension("customer-account.page.render", () => <Render />);

function Render() {
  const { sessionToken } = useApi();

  return (
    <Provider api={api} sessionToken={sessionToken}>
      <Wishlists />
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
    <Page title="Wishlists">
      <Grid columns={250} rows="auto" spacing="base" blockAlignment="center">
        {wishlists?.map((item) => {
          return (
            <GridItem columnSpan={1}>
              <ResourceItem to={`/wishlist/${item.id}`} key={item.id}>
                <BlockStack>
                  <Text>{item.name}</Text>
                </BlockStack>
              </ResourceItem>
            </GridItem>
          );
        })}
      </Grid>
    </Page>
  );
}

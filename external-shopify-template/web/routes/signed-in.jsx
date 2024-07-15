import { useSignOut, useAction } from "@gadgetinc/react";
import { api } from "../api";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext, ParamContext, ShopContext } from "../providers";
import { BlockStack, Box, Card, Text, Button } from "@shopify/polaris";

export default function () {
  const signOut = useSignOut();
  const { user } = useContext(AuthContext);
  const { shop } = useContext(ShopContext);
  const { paramHistory } = useContext(ParamContext);

  const [_, setShop] = useAction(api.user.setShop);

  useEffect(() => {
    if (user && !user?.shopId && (paramHistory?.token || shop?.authToken)) {
      const run = async () => {
        await setShop({
          id: user.id,
          token: paramHistory?.token || shop?.authToken,
        });
      };

      run();
    }
  }, [user?.id, paramHistory?.token, shop?.authToken]);

  return user ? (
    <>
      <Box className="app-link">
        <img
          src={`https://${process.env.GADGET_PUBLIC_APP_SLUG}${process.env.GADGET_PUBLIC_APP_ENV !== "production" ? `--${process.env.GADGET_PUBLIC_APP_ENV}` : ""}.gadget.app/shopify_glyph_black.svg`}
          alt="Shopify logo"
          height={70}
        />

        <Text as="span">You are now signed into {process.env.GADGET_APP}</Text>
      </Box>
      <Box>
        <Text as="p">Start building your app&apos;s signed in area</Text>
        <a
          href="/edit/files/web/routes/signed-in.jsx"
          target="_blank"
          rel="noreferrer"
          style={{ fontWeight: 500 }}
        >
          web/routes/signed-in.jsx
        </a>
      </Box>
      <BlockStack className="card-stack">
        <Card>
          <Text as="h2" variant="headingLg">
            User
          </Text>
          <Box className="card-content">
            <img
              className="icon"
              src={
                user.googleImageUrl ??
                "https://assets.gadget.dev/assets/default-app-assets/default-user-icon.svg"
              }
            />
            <BlockStack className="userData">
              <Text as="p">id: {user?.id}</Text>
              <Text as="p">
                name: {user?.firstName} {user?.lastName}
              </Text>
              <Text as="p">
                email: <a href={`mailto:${user?.email}`}>{user?.email}</a>
              </Text>
              <Text as="p">created: {user?.createdAt?.toString()}</Text>
            </BlockStack>
          </Box>
        </Card>
        {shop && (
          <Card>
            <Text as="h2" variant="headingLg">
              Shop
            </Text>
            <Box className="card-content">
              <BlockStack className="userData">
                <Text as="p">id: {shop.id}</Text>
                <Text as="p">domain: {shop.domain}</Text>
                <Text as="p">shopOwner: {shop.shopOwner}</Text>
              </BlockStack>
            </Box>
          </Card>
        )}
        <Box>
          <Text as="h2" variant="headingLg">
            Actions:
          </Text>
          <BlockStack>
            <Link to="/change-password">Change password</Link>
            <Button variant="monochromePlain" onClick={signOut}>
              Sign Out
            </Button>
          </BlockStack>
        </Box>
      </BlockStack>
    </>
  ) : null;
}

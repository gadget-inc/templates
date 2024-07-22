import { useSignOut, useUser } from "@gadgetinc/react";
import { api } from "../api";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../providers";
import { BlockStack, Box, Card, Text, Button } from "@shopify/polaris";

export default function () {
  const signOut = useSignOut();
  const user = useUser();
  const { shops } = useContext(ShopContext);

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
        {shops?.map(({ id, domain, shopOwner }) => (
          <Card key={id}>
            <Text as="h2" variant="headingLg"></Text>
            <Box className="card-content">
              <BlockStack className="userData">
                <Text as="p">id: {id}</Text>
                <Text as="p">domain: {domain}</Text>
                <Text as="p">shopOwner: {shopOwner}</Text>
              </BlockStack>
            </Box>
          </Card>
        ))}

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

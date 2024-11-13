import { useSignOut } from "@gadgetinc/react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ShopContext, AuthContext } from "../providers";
import { BlockStack, Card, Text, Button, Box } from "@shopify/polaris";
import { ShopContextType } from "../providers/ShopProvider";
import { AuthContextType } from "../providers/AuthProvider";

export default function () {
  const signOut = useSignOut();
  const { user }: AuthContextType = useContext(AuthContext);
  const { shops }: ShopContextType = useContext(ShopContext);

  return user ? (
    <>
      <BlockStack>
        <img
          src={`https://${process.env.GADGET_PUBLIC_APP_SLUG}${process.env.GADGET_PUBLIC_APP_ENV !== "production" ? `--${process.env.GADGET_PUBLIC_APP_ENV}` : ""}.gadget.app/shopify_glyph_black.svg`}
          alt="Shopify logo"
          height={70}
        />

        <Text as="span">You are now signed into {process.env.GADGET_APP}</Text>
      </BlockStack>
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
      <BlockStack gap="300">
        <Card>
          <BlockStack inlineAlign="center" gap="200">
            <Text as="h2" variant="headingLg">
              User
            </Text>
            <img
              className="icon"
              src={
                user.googleImageUrl ??
                "https://assets.gadget.dev/assets/default-app-assets/default-user-icon.svg"
              }
            />
            <BlockStack gap="100">
              <Text as="p">id: {user?.id}</Text>
              <Text as="p">
                name: {user?.firstName} {user?.lastName}
              </Text>
              <Text as="p">
                email: <a href={`mailto:${user?.email}`}>{user?.email}</a>
              </Text>
              <Text as="p">created: {user?.createdAt?.toString()}</Text>
            </BlockStack>
          </BlockStack>
        </Card>
        {shops?.map(({ id, domain, shopOwner }) => (
          <Card key={id}>
            <Text as="h2" variant="headingLg">
              Shop information
            </Text>
            <Box>
              <BlockStack>
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

import { useFindFirst, useSession, useFindMany } from "@gadgetinc/react";
import { useNavigate } from "react-router-dom";
import { Page, Spinner, Text, Button } from "@shopify/polaris";
import { api } from "../api";
import InstagramImage from "../assets/InstagramImage.svg";
import Checkmark from "../assets/checkmark.svg";
import "../components/App.css";

export default () => {
  const navigate = useNavigate();
  const session = useSession();

  const [{ data, fetching, error }] = useFindFirst(api.shopifyShop);
  const [{ data: account }] = useFindFirst(api.instagramAccount, {
    suspense: true,
  });
  const [{ data: posts }] = useFindMany(api.instagramPost, {
    live: true,
    first: 10,
    sort: { createdAt: "Descending" },
  });

  let connected = !!account;

  if (error) {
    return (
      <Page title="Error">
        <Text variant="bodyMd" as="p">
          Error: {error.toString()}
        </Text>
      </Page>
    );
  }

  if (fetching) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }

  if (!connected) {
    //Return connect to instagram page if not connected
    return (
      <Page>
        <div className="content-wrapper">
          <img className="content-image" src={InstagramImage} />
          <div className="text-wrapper">
            <Text variant="headingXl" as="h2">
              Connect your Instagram feed
            </Text>
            <Text variant="bodyLg" alignment="center" as="p">
              Please connect to your Instagram account to begin synchronizing
              Instagram posts to your Shopify store.
            </Text>
          </div>
          <Button
            variant="primary"
            size="large"
            onClick={() =>
              open(
                `https://${
                  new URL(process.env.GADGET_PUBLIC_SHOPIFY_APP_URL).hostname
                }/auth/instagram?sessionId=${session.id}`
              )
            }
          >
            Connect
          </Button>
        </div>
      </Page>
    );
  }

  const url = "https://www.instagram.com/" + account.accountName;
  //Return Success! if connected successfully
  return (
    <Page>
      <div className="content-wrapper">
        <img className="content-image" src={Checkmark} />
        <div className="text-wrapper">
          <Text variant="headingXl" as="h2">
            Success!
          </Text>
          <Text variant="bodyLg" alignment="center" as="p">
            This app is now syncing Instagram posts from{" "}
            <a
              href={url}
              onClick={(e) => {
                e.preventDefault();
                open(url);
              }}
            >
              {account.accountName}
            </a>{" "}
            on a hourly schedule.
          </Text>
        </div>
        <Button
          variant="primary"
          size="large"
          onClick={() => navigate("/content/entries", { target: "host" })}
        >
          Manage metaobjects
        </Button>
      </div>
    </Page>
  );
};

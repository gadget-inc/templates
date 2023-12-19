import { Text, Button, InlineStack } from "@shopify/polaris";
import { api } from "../api";
import { useGlobalAction } from "@gadgetinc/react";
import { useCallback, useEffect } from "react";

export default ({ reauth = false, setShow, setBannerContext }) => {
  const [
    { error: errorFetchingRedirect, fetching: fetchingRedirect },
    getSlackAuthRedirect,
  ] = useGlobalAction(api.getSlackAuthRedirect);

  // Handler for fetching the OAuth redirect to start the Slack auth flow
  const handleButtonClick = useCallback(async () => {
    const redirect = (await getSlackAuthRedirect()).data;
    if (redirect) {
      open(redirect, "_top");
    }
  }, []);

  // useEffect for showing an error banner when there's an issue fetching the Slack OAuth redirect URL
  useEffect(() => {
    if (!fetchingRedirect && errorFetchingRedirect) {
      setBannerContext(errorFetchingRedirect.message);
      setShow(true);
    } else if (fetchingRedirect) {
      setShow(false);
    }
  }, [fetchingRedirect, errorFetchingRedirect]);

  return (
    <Button size="large" onClick={handleButtonClick}>
      <InlineStack>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: "24px", width: "24px", marginRight: "12px" }}
          viewBox="0 0 122.8 122.8"
        >
          <path
            d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
            fill="#e01e5a"
          ></path>
          <path
            d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
            fill="#36c5f0"
          ></path>
          <path
            d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
            fill="#2eb67d"
          ></path>
          <path
            d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
            fill="#ecb22e"
          ></path>
        </svg>
        <Text as="span" variant="bodyLg">
          {reauth ? "Reauthorize Slack" : "Add to Slack"}
        </Text>
      </InlineStack>
    </Button>
  );
};
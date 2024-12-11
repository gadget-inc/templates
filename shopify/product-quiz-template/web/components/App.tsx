import {
  AppType,
  Provider as GadgetProvider,
  useGadget,
} from "@gadgetinc/react-shopify-app-bridge";
import { NavMenu } from "@shopify/app-bridge-react";
import { Page, Spinner, Text } from "@shopify/polaris";
import { useEffect, useMemo } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";
import { HomePage, EditQuizPage, CreateQuizPage } from "../routes";
import { api } from "../api";

const Error404 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      process.env.GADGET_PUBLIC_SHOPIFY_APP_URL &&
      location.pathname ===
        new URL(process.env.GADGET_PUBLIC_SHOPIFY_APP_URL).pathname
    )
      return navigate("/", { replace: true });
  }, [location.pathname]);

  return <div>404 not found</div>;
};

export default () => {
  const navigate = useNavigate();
  interface History {
    replace: (path: string) => void;
  }

  const history: History = useMemo(
    () => ({ replace: (path: string) => navigate(path, { replace: true }) }),
    [navigate]
  );

  return (
    <GadgetProvider
      type={AppType.Embedded}
      shopifyApiKey={window.gadgetConfig.apiKeys.shopify}
      api={api}
    >
      <AuthenticatedApp />
    </GadgetProvider>
  );
};

function AuthenticatedApp() {
  // we use `isAuthenticated` to render pages once the OAuth flow is complete!
  const { isAuthenticated, loading } = useGadget();
  if (loading) {
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
  return isAuthenticated ? <EmbeddedApp /> : <UnauthenticatedApp />;
}

function EmbeddedApp() {
  return (
    <>
      <NavMenu>
        <Link to="/create-quiz">Create quiz</Link>
      </NavMenu>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-quiz" element={<CreateQuizPage />} />
        <Route path="/edit-quiz/:id" element={<EditQuizPage />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}

function UnauthenticatedApp() {
  return (
    <Page title="App">
      <Text variant="bodyMd" as="p">
        App can only be viewed in the Shopify Admin.
      </Text>
    </Page>
  );
}

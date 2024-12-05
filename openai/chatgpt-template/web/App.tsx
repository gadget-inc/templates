import {
  SignedInOrRedirect,
  SignedOutOrRedirect,
  Provider,
} from "@gadgetinc/react";
import { Suspense, useEffect } from "react";
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useNavigate,
} from "react-router-dom";
import { api } from "./api";
import Index from "./routes/index";
import Chat from "./routes/chat";
import SignInPage from "./routes/sign-in";
import SignUpPage from "./routes/sign-up";
import ResetPasswordPage from "./routes/reset-password";
import VerifyEmailPage from "./routes/verify-email";
import ChangePassword from "./routes/change-password";
import ForgotPassword from "./routes/forgot-password";
import { ChakraBaseProvider, Box } from "@chakra-ui/react";
import { theme } from "@chakra-ui/theme";
import { ChatProvider } from "./hooks/useChat";

const App = () => {
  useEffect(() => {
    document.title = `Gadget x ChatGPT`;
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <SignedOutOrRedirect path="/chat-gpt">
              <Index />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="chat-gpt"
          element={
            <SignedInOrRedirect>
              <ChatProvider>
                <Chat />
              </ChatProvider>
            </SignedInOrRedirect>
          }
        />
        <Route
          path="change-password"
          element={
            <SignedInOrRedirect>
              <ChangePassword />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="forgot-password"
          element={
            <SignedOutOrRedirect>
              <ForgotPassword />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="sign-in"
          element={
            <SignedOutOrRedirect>
              <SignInPage />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="sign-up"
          element={
            <SignedOutOrRedirect>
              <SignUpPage />
            </SignedOutOrRedirect>
          }
        />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
      </Route>
    )
  );

  return (
    <Suspense fallback={<></>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

const Layout = () => {
  const navigate = useNavigate();
  return (
    <Provider
      api={api}
      navigate={navigate}
      auth={window.gadgetConfig.authentication}
    >
      <ChakraBaseProvider theme={theme}>
        <Box height="100vh" width="100vw" bgColor="gray.700" color="gray.100">
          <Outlet />
        </Box>
      </ChakraBaseProvider>
    </Provider>
  );
};

export default App;

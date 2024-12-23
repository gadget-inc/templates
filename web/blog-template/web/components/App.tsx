import {
  SignedInOrRedirect,
  SignedIn,
  SignedOut,
  SignedOutOrRedirect,
  Provider,
  useUser,
  useSignOut,
} from "@gadgetinc/react";
import { Suspense, useEffect } from "react";
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useNavigate,
  Link,
} from "react-router-dom";
import { api } from "../api";
import Index from "../routes/index";
import SignedInPage from "../routes/signed-in";
import SignInPage from "../routes/sign-in";
import SignUpPage from "../routes/sign-up";
import ResetPasswordPage from "../routes/reset-password";
import VerifyEmailPage from "../routes/verify-email";
import ChangePassword from "../routes/change-password";
import ForgotPassword from "../routes/forgot-password";
import { Avatar, Button, Box, Flex } from "@chakra-ui/react";

export default () => {
  useEffect(() => {
    document.title = `Home - ${process.env.GADGET_PUBLIC_APP_SLUG} - Gadget`;
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Index />} />
        <Route
          path="signed-in"
          element={
            <SignedInOrRedirect>
              <SignedInPage />
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
      <Header />
      <Outlet />
    </Provider>
  );
};

const Header = () => {
  // the useUser() hook is used to get and display info about the current user
  // in this case, your Google account profile picture
  const user = useUser(api);

  // signout and redirect when the "Sign out" button is clicked
  const signOut = useSignOut();

  // return the nav bar component
  // the SignedIn component is used to display the "Admin" link and "Sign out" button if you are signed in
  // the SignedOut component is used to display the "Sign in" button if you are not signed in
  return (
    <Box>
      <Flex
        minH="60px"
        py={{ base: 2 }}
        px={{ base: 4 }}
        align="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center" gap="10px">
          <Link style={{ textDecoration: "none" }} to="/">
            <Button
              variant="link"
              style={{ textDecoration: "none" }}
              pl="40px"
              fontSize="24px"
              fontWeight="600"
              lineHeight="30px"
            >
              {process.env["GADGET_PUBLIC_APP_SLUG"]}
            </Button>
          </Link>
        </Flex>
        <Flex gap="24px" alignItems="center">
          <SignedIn>
            <Link style={{ textDecoration: "none" }} to="/">
              <Button variant="link">Blog</Button>
            </Link>
            <Link style={{ textDecoration: "none" }} to="/signed-in">
              <Button variant="link">Admin</Button>
            </Link>
            <Link style={{ textDecoration: "none" }} to="/change-password">
              <Button variant="link">Change password</Button>
            </Link>
            <Flex align="center" gap="2">
              <Button onClick={signOut} variant="link">
                Sign out
              </Button>
              {user && <Avatar src={user.googleImageUrl ?? ""} />}
            </Flex>
          </SignedIn>
          <SignedOut>
            <Link style={{ textDecoration: "none" }} to="/sign-up">
              <Button variant="link">Sign up</Button>
            </Link>
            <Link style={{ textDecoration: "none" }} to="/sign-in">
              <Button variant="link">Sign in</Button>
            </Link>
          </SignedOut>
        </Flex>
      </Flex>
    </Box>
  );
};

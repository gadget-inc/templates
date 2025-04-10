import { Provider } from "@gadgetinc/react";
import { Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router";
import { api } from "../api";
import "../app.css";
import ForgotPasswordPage from "../routes/forgot-password";
import IndexPage from "../routes/index";
import ProfilePage from "../routes/profile";
import InvitePage from "../routes/invite";
import TeamPage from "../routes/team";
import ResetPasswordPage from "../routes/reset-password";
import SignInPage from "../routes/sign-in";
import SignedInPage from "../routes/signed-in";
import VerifyEmailPage from "../routes/verify-email";
import Post from "../routes/post";
import AnonLayout from "./layouts/AnonLayout";
import UserLayout from "./layouts/UserLayout";

const App = () => {
  useEffect(() => {
    document.title = `${window.gadgetConfig.env.GADGET_APP}`;
  }, []);

  return (
    <Suspense fallback={<></>}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route element={<AnonLayout />}>
              <Route index element={<IndexPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="sign-in" element={<SignInPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="verify-email" element={<VerifyEmailPage />} />
            </Route>
            <Route element={<UserLayout />}>
              <Route path="signed-in" element={<SignedInPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="invite" element={<InvitePage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="post/:id?" element={<Post />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
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
      <Outlet />
    </Provider>
  );
};

export default App;

import { Provider } from "@gadgetinc/react";
import { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { createBrowserRouter, RouterProvider } from "react-router";
import { api } from "../api";
import "../app.css";
import IndexPage from "../routes/index";
import AnonLayout from "./layouts/AnonLayout";

const Layout = () => {
  const navigate = useNavigate();

  return (
    <Provider api={api} navigate={navigate}>
      <Outlet />
    </Provider>
  );
};

const routes = [
  {
    element: <Layout />,
    children: [
      {
        element: <AnonLayout />,
        children: [
          {
            index: true,
            element: <IndexPage />,
            loader: async () => {
              return {
                exists: await api.checkMoviesExist()
              };
            }
          }
        ]
      }
    ]
  }
];

const router = createBrowserRouter(routes);

const App = () => {
  useEffect(() => {
    document.title = `${window.gadgetConfig.env.GADGET_APP}`;
  }, []);

  return (
    <Suspense fallback={<></>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;

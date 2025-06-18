import { Link } from "@remix-run/react";
import { NavMenu as AppBridgeNavMenu } from "@shopify/app-bridge-react";

export function NavMenu() {
  return (
    <AppBridgeNavMenu>
      <Link to="/" rel="home">
        Index
      </Link>
      <Link to="/quiz" rel="newQuiz">
        New quiz
      </Link>
      <Link to="/install" rel="installation">
        Installation
      </Link>
    </AppBridgeNavMenu>
  );
}

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
      <Link to="/install">Install</Link>
      {/* Remove the setup link when going live */}
      <Link to="/setup">Template setup</Link>
    </AppBridgeNavMenu>
  );
}

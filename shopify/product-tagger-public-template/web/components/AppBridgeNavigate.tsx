import { useEffect } from "react";
import { useNavigate } from "react-router";

/**
 * Listens for `shopify:navigate` events dispatched by `<s-link>` web components
 * and routes them through the app's client-side router.
 *
 * Mount this component once near the top of your component tree (inside a router context)
 * so that all `<s-link>` elements trigger client-side navigation instead of full page reloads.
 */
export function AppBridgeNavigate() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const href = (event.target as HTMLElement)?.getAttribute("href");
      if (href) {
        navigate(href);
      }
    };

    document.addEventListener("shopify:navigate", handleNavigate);
    return () => document.removeEventListener("shopify:navigate", handleNavigate);
  }, [navigate]);

  return null;
}

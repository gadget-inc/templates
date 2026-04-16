/*
NOTE ABOUT TYPES
- There is a known issue with Polaris web component types - https://community.shopify.dev/t/missing-app-bridge-type-declarations-for-s-app-nav/26478
- The `<s-app-nav>` JSX component has broken types when used in React 19 with @shopify/polaris-types v1.0.1
- The actual component works properly as documented - https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav
*/

export function NavMenu() {
  return (
    <>
      {/* @ts-expect-error Property 's-app-nav' does not exist on type 'JSX.IntrinsicElements' */}
      <s-app-nav>
        <s-link href="/">Bundles</s-link>
        <s-link href="/bundle">Create a bundle</s-link>
        {/* @ts-expect-error Property 's-app-nav' does not exist on type 'JSX.IntrinsicElements' */}
      </s-app-nav>
    </>
  );
}

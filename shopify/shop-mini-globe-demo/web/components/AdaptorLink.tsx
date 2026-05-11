// from https://polaris.shopify.com/components/utilities/app-provider#using-linkcomponent
import { Link } from "react-router";
import type { AppProviderProps } from "@shopify/polaris";
import type { ComponentProps } from "react";

const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

export function AdaptorLink({children, url = "", external, ref, ...rest}: ComponentProps<NonNullable<AppProviderProps["linkComponent"]>>) {

  if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
    rest.target = "_blank";
    rest.rel = "noopener noreferrer";
    return (
      <a href={url} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link to={url} {...rest}>
      {children}
    </Link>
  );
}

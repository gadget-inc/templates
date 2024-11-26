import {
  Controller,
  useActionForm,
  useFindFirst,
  useGlobalAction,
} from "@gadgetinc/react";
import {
  Card,
  Layout,
  Page,
  Spinner,
  Text,
  BlockStack,
  Button,
  Form,
  FormLayout,
  Listbox,
  Combobox,
  Icon,
  Frame,
  Toast,
  Banner,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { api } from "../api";
import SlackAuthButton from "../components/SlackAuthButton";
import { useState, useCallback, useEffect, useMemo, useContext } from "react";
import { GadgetRecord } from "@gadget-client/sales-tracker-template";
import { ShopContext } from "../providers/ShopProvider";

type Channel = {
  label: string;
  value: string;
};

export default () => {
  const { shop } = useContext(ShopContext);

  return <>Settings</>;
  // Add slack stuff here
};

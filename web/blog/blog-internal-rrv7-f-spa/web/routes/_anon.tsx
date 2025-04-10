import { Outlet, redirect, useOutletContext } from "react-router";
import type { RootOutletContext } from "../root";
import { useUser } from "@gadgetinc/react";
import { useEffect } from "react";

export default function () {
  const user = useUser();
  const { gadgetConfig } = useOutletContext<RootOutletContext>();

  useEffect(() => {
    if (user) {
      redirect(gadgetConfig?.authentication!.redirectOnSuccessfulSignInPath!);
    }
  }, [user]);

  const context = useOutletContext<RootOutletContext>();

  return (
    <div className="w-screen h-screen grid place-items-center">
      <Outlet context={context} />
    </div>
  );
}

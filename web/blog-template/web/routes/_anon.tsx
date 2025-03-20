import { Outlet, redirect, useOutletContext } from "react-router";
import type { RootOutletContext } from "../root";
import type { Route } from "./+types/_anon";

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { session, gadgetConfig } = context;

  const signedIn = !!session?.get("user");

  if (signedIn) {
    return redirect(
      gadgetConfig.authentication!.redirectOnSuccessfulSignInPath!
    );
  }

  return {};
};

export default function () {
  const context = useOutletContext<RootOutletContext>();

  return (
    <div className="w-screen h-screen grid place-items-center">
      <Outlet context={context} />
    </div>
  );
}

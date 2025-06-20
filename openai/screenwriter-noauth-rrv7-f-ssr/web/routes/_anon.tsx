import { Outlet, useOutletContext } from "react-router";
import type { RootOutletContext } from "../root";

export default function () {
  const context = useOutletContext<RootOutletContext>();

  return (
    <div className="w-screen h-screen grid place-items-center">
      <Outlet context={context} />
    </div>
  );
}

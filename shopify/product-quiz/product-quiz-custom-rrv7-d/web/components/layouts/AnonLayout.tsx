import { Outlet } from "react-router";

export default function() {
  return (
    <div className="w-screen h-screen grid place-items-center">
      <Outlet />
    </div>
  );
}

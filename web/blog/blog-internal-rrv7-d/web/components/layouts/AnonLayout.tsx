import { SignedOutOrRedirect } from "@gadgetinc/react";
import { Link, Outlet } from "react-router";
import { Button } from "../ui/button";

export default function () {
  return (
    <SignedOutOrRedirect>
      <div className="min-h-screen flex">
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 border-b bg-background w-screen">
            <Link to="/" className="flex items-center">
              <img
                src="/api/assets/autologo?background=dark"
                alt="App name"
                className="h-8 w-auto"
              />
            </Link>
            <div className="flex gap-4">
              {/* We recommend removing this once going live. It's meant for internal use only */}
              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link to="/sign-in">Sign in</Link>
              </Button>
            </div>
          </header>
          <Outlet />
        </div>
      </div>
    </SignedOutOrRedirect>
  );
}

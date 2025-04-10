import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { useSignOut, useUser } from "@gadgetinc/react";
import { BookText, Home, LogOut, Mail, Menu, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  redirect,
  useLocation,
  useOutletContext,
} from "react-router";
import type { RootOutletContext } from "../root";

export type AuthOutletContext = RootOutletContext & {
  user: any;
};

const UserMenu = () => {
  const user = useUser();
  const { gadgetConfig } = useOutletContext<RootOutletContext>();
  const [userMenuActive, setUserMenuActive] = useState(false);
  const signOut = useSignOut();

  const getInitials = () => {
    return (
      (user?.firstName?.slice(0, 1) ?? "") + (user?.lastName?.slice(0, 1) ?? "")
    ).toUpperCase();
  };

  useEffect(() => {
    if (!user) {
      redirect(gadgetConfig?.authentication!.signInPath);
    }
  }, [user]);

  return (
    <DropdownMenu open={userMenuActive} onOpenChange={setUserMenuActive}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-1 hover:bg-accent">
          <Avatar>
            {user?.profilePicture?.url ? (
              <AvatarImage
                src={user.profilePicture.url}
                alt={user.firstName ?? user.email}
              />
            ) : (
              <AvatarFallback>{getInitials()}</AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-medium">
            {user?.firstName ?? user?.email}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/team" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Team
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/invite" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            Invite
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={signOut}
          className="flex items-center text-red-600 focus:text-red-600 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SideBar = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col flex-grow bg-background border-r h-full">
      <div className="h-16 flex items-center px-6 border-b">
        <Link to="/" className="flex items-center">
          <img
            src="/api/assets/autologo?background=dark"
            alt="App logo"
            className="h-8 w-auto"
          />
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        <Link
          to="/signed-in"
          className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors
              ${
                location.pathname === "/signed-in"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
        >
          <Home className="mr-3 h-4 w-4" />
          Home
        </Link>
        <Link
          to="/post"
          className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors
              ${
                location.pathname === "/post"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
        >
          <BookText className="mr-3 h-4 w-4" />
          New post
        </Link>
      </nav>
    </div>
  );
};

const SideBarMenuButtonDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="md:hidden z-30" // Only show on slim screen
    >
      <button
        className="flex items-center rounded-full hover:bg-accent p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>
      <div
        className={`fixed inset-y-0 left-0 w-64 transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } bg-background shadow-lg z-20`}
      >
        <SideBar />
      </div>

      {isOpen && (
        // Background opacity cover
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 z-10"
        />
      )}
    </div>
  );
};

export default function () {
  const user = useUser();
  const rootOutletContext = useOutletContext<RootOutletContext>();

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-30">
        <SideBar />
      </div>

      <div className="flex-1 flex flex-col md:pl-64">
        <header className="h-16 flex items-center justify-between px-6 border-b bg-background">
          <SideBarMenuButtonDrawer />
          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <Outlet
              context={{ ...rootOutletContext, user } as AuthOutletContext}
            />
            <Toaster richColors />
          </div>
        </main>
      </div>
    </div>
  );
}

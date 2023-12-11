import { useUser, useSignOut } from "@gadgetinc/react";
import { api } from "../api";
import userIcon from "../assets/default-user-icon.svg";
import { Link } from "react-router-dom";
import { ReactLogo } from "../components";

export default function () {
  const user = useUser(api);
  const signOut = useSignOut();

  return user ? (
    <>
      <div className="font-[system-ui] font-bold text-[larger] gap-2 flex flex-col w-full">
        <ReactLogo />
        <span>You are now signed into {process.env.GADGET_PUBLIC_APP_SLUG} </span>
      </div>
      <div>
        <p className="font-[250] mb-1.5 w-full">
          Start building your app&apos;s signed in area
        </p>
        <a className="font-medium text-[#0000ee]" href="/edit/files/frontend/routes/signed-in.jsx" target="_blank" rel="noreferrer">
          frontend/routes/signed-in.jsx
        </a>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col flex-auto rounded-lg border-[1px] border-solid border-[#e2e2e2] bg-white p-6 g-4 text-black">
          <div className="flex flex-wrap text-left justify-evenly items-center self-stretch g-8 rounded-lg font-[14px] whitespace-nowrap">
            <img className="rounded-[100px] w-16 h-16" src={user.googleImageUrl ?? userIcon} />
            <div className="flex flex-col items-start g-1 font-light">
              <p>id: {user.id}</p>
              <p>
                name: {user.firstName} {user.lastName}
              </p>
              <p>
                email: <a href={`mailto:${user.email}`} className="text-[#0000ee]">{user.email}</a>
              </p>
              <p>created: {user.createdAt.toString()}</p>
            </div>
          </div>
          <div className="text-[#545454] text-center text-xs pt-6">This data is fetched from the user model</div>
        </div>
        <div className="flex flex-col gap-1">
          <strong>Actions:</strong>
          <Link to="/change-password" className="text-[#0000ee]">Change password</Link>
          <a onClick={signOut} className="cursor-pointer">
            Sign Out
          </a>
        </div>
      </div>
    </>
  ) : null;
}

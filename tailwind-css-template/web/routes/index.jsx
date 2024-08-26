import reactLogo from "../assets/react-logo.svg";

export default function () {
  return (
    <>
      <div className="font-[system-ui] font-bold text-[larger] gap-4 flex flex-col w-full">
        <img src={reactLogo} className="h-20 my-0 mx-auto block pointer-events-none motion-safe:animate-app-logo-spin" alt="logo" />
        <span>You are now signed out of {process.env.GADGET_PUBLIC_APP_SLUG} &nbsp;</span>
      </div>
      <div>
        <p className="font-[250] mb-1.5">Start building your app&apos;s signed out area</p>
        <a href="/edit/files/frontend/routes/index.jsx" target="_blank" rel="noreferrer" className="font-medium underline text-[#0000ee]">
          frontend/routes/index.jsx
        </a>
      </div>
    </>
  );
}

import reactLogo from "../assets/react-logo.svg";

export default function () {
  return (
    <>
      <div className="app-link">
        <img src={reactLogo} className="app-logo" alt="logo" />
        <span>You are now signed out of {process.env.GADGET_PUBLIC_APP_SLUG} &nbsp;</span>
      </div>
      <div>
        <p className="description">Start building your app&apos;s signed out area</p>
        <a href="/edit/files/frontend/routes/index.jsx" target="_blank" rel="noreferrer" style={{ fontWeight: 500 }}>
          frontend/routes/index.jsx
        </a>
      </div>
    </>
  );
}

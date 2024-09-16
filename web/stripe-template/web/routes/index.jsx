import reactLogo from "../assets/react-logo.svg";

export default function () {
  return (
    <>
      <div className="app-link">
        <img src={reactLogo} className="app-logo" alt="logo" />
        <span>{process.env.GADGET_PUBLIC_APP_SLUG} requires some setup</span>
      </div>
      <div>
        <p className="description">Follow the Readme to setup your Stripe API keys</p>
        <a href="/edit/files/README.md" target="_blank" rel="noreferrer" style={{ fontWeight: 500 }}>
          README.md
        </a>
      </div>
    </>
  );
}

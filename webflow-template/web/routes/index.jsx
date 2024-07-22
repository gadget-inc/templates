
export default function () {
  return (
    <>
      <div className="app-link">
        <img src="https://assets.gadget.dev/assets/default-app-assets/react-logo.svg" className="app-logo" alt="logo" />
        <span>You are now signed out of {process.env.GADGET_APP} &nbsp;</span>
      </div>
      <div>
        <p className="description">Start building your app&apos;s signed out area</p>
        <a href="/edit/files/web/routes/index.jsx" target="_blank" rel="noreferrer" style={{ fontWeight: 500 }}>
          web/routes/index.jsx
        </a>
      </div>
    </>
  );
}

import reactLogo from "../assets/react-logo.svg";
import { Link } from "react-router-dom";

export default function () {
  return (
    <>
      <div className="app-link">
        <img src={reactLogo} className="app-logo" alt="logo" />
        <span>Welcome to {process.env.GADGET_PUBLIC_APP_SLUG}</span>
        <p className="description"><Link to="/sign-up">Sign up</Link> to use the screenwriter</p>
      </div>
      <div>
        <p className="description small">Edit this page: <a href="/edit/files/frontend/routes/index.jsx" target="_blank" rel="noreferrer" >
          frontend/routes/index.jsx
        </a>
        </p>
      </div>
    </>
  );
}

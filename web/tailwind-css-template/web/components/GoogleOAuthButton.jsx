import GoogleIcon from "../assets/google.svg";

export const GoogleOAuthButton = ({ search }) => (
  <a className="flex py-3 px-4 items-center justify-center gap-3 self-stretch rounded border border-solid border-[#e2e2e2] bg-white hover:bg-[#eee] pointer no-underline font-normal text-[#0000ee] max-w-[350px]" href={`/auth/google/start${search}`}>
    <img src={GoogleIcon} width={22} height={22} /> Continue with Google
  </a>
);
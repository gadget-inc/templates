import { Link, useOutletContext } from "react-router";
import type { RootOutletContext } from "../root";
import type { Route } from "./+types/_anon.verify-email";

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  try {
    await context.api.user.verifyEmail({ code });
    return { success: true, error: null };
  } catch (error) {
    return {
      error: { message: (error as Error).message },
      success: false,
    };
  }
};

export default function ({ loaderData }: Route.ComponentProps) {
  const { gadgetConfig } = useOutletContext<RootOutletContext>();
  const { success, error } = loaderData;

  if (error) {
    return <p className="format-message error">{error.message}</p>;
  }

  return success ? (
    <p className="format-message success">
      Email has been verified successfully.{" "}
      <Link to={gadgetConfig.authentication!.signInPath}>Sign in now</Link>
    </p>
  ) : null;
}

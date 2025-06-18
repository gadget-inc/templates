import { json, type LoaderFunctionArgs } from "@remix-run/node";

export function loader({ context }: LoaderFunctionArgs) {
  return json({});
}

export default function () {
  return <div>_app.install</div>;
}

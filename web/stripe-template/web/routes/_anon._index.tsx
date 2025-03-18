import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Route } from "./+types/_anon._index";

export const loader = async ({ context }: Route.LoaderArgs) => {
  return {
    metaData: await context.api.query(`
      query {
        gadgetMeta {
          environmentSlug
          slug
        }
      }
    `),
  };
};

export default function ({ loaderData }: Route.ComponentProps) {
  const { metaData } = loaderData;

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-6 border-b bg-background w-screen">
          <Link to="/" className="flex items-center">
            <img
              src="/api/assets/autologo?background=dark"
              alt="App name"
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex gap-4">
            <Button variant="default" size="lg" className="w-full" asChild>
              <Link to="/sign-up">Sign up</Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link to="/sign-in">Sign in</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8 h-full">
            <div className="flex flex-col gap-4 justify-center items-center h-full">
              <div className="flex flex-col items-center gap-2 font-bold text-2xl">
                <img src="/stripe-logo.svg" alt="Stripe logo" />
                <span>
                  {process.env.GADGET_PUBLIC_APP_SLUG} requires some setup
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p>Follow the template documentation:</p>
                <a
                  href={`https://docs.gadget.dev/api/${metaData.gadgetMeta.slug}/${metaData.gadgetMeta.environmentSlug}/template-setup`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600"
                >
                  See instructions
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

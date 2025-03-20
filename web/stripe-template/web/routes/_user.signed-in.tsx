import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect, useOutletContext } from "react-router";
import type { AuthOutletContext } from "./_user";
import { Route } from "./+types/_user.signed-in";
import { AutoButton } from "@/components/auto";
import { api } from "@/api";
import { toast } from "sonner";

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const userId = context.session?.get("user");

  if (!userId) return redirect("/sign-in");

  const url = new URL(request.url);

  const user = await context.api.user.findOne(userId, {
    select: {
      stripeCustomerId: true,
    },
  });

  if (!user.stripeCustomerId && url.searchParams.get("canceled"))
    return redirect("/billing");
};

export default function () {
  const { user } = useOutletContext<AuthOutletContext>();

  return (
    <section className="flex justify-center">
      <Card className="max-w-3xl p-6">
        <CardHeader>
          <CardTitle>User details</CardTitle>
          <CardDescription>
            {user?.stripeCustomerId ? user.stripeCustomerId : "No customer id"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {user?.stripeCustomerId && !user?.stripeSubscription && (
            <p>
              You currently <strong>do not</strong> have an active subscription.
              Go to the <strong>billing</strong> page to subscribe.
            </p>
          )}
          {user?.stripeCustomerId && (
            <p>
              You can manage your Stripe customer account using the button
              below. It will bring you to the Stripe customer portal where you
              can cancel your subscription and change card information.
            </p>
          )}
        </CardContent>
        {user?.stripeCustomerId && (
          <CardFooter>
            <AutoButton
              action={api.createPortalSession}
              onSuccess={({ data }) => {
                window.location.href = data;
              }}
              onError={(error) => {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "An unknown error occurred"
                );
              }}
            >
              Customer portal
            </AutoButton>
          </CardFooter>
        )}
      </Card>
    </section>
  );
}

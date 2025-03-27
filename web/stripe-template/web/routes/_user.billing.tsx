import { useState } from "react";
import { Route } from "./+types/_user.billing";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AutoButton } from "@/components/auto";
import { api } from "@/api";
import { redirect } from "react-router";
import ProductCard from "@/components/ProductCard";
import { Switch } from "@/components/ui/switch";

export type Product = {
  name: string;
  id: string;
  prices: {
    id: string;
    unitAmount: number;
    interval: string;
    lookupKey: string;
    current: boolean;
  }[];
};

export const loader = async ({ context }: Route.LoaderArgs) => {
  const userId = context.session?.get("user");

  if (!userId) return redirect("/sign-in");

  return {
    products: await context.api.getProducts({ userId }),
  };
};

export default ({ loaderData }: Route.ComponentProps) => {
  const { products } = loaderData;
  const [toggled, setToggled] = useState(false);

  return (
    <div className=" flex justify-center">
      {products ? (
        <div className="flex flex-col gap-6 w-full max-w-3xl p-6">
          <div className="flex flex-row justify-between items-center">
            <h2 className="font-bold text-2xl">Plans</h2>
            <div className="flex flex-row items-center gap-2">
              <span>{toggled ? "Yearly" : "Monthly"}</span>
              <Switch
                className="data-[state=checked]:bg-pink-400"
                onCheckedChange={setToggled}
              />
            </div>
          </div>
          <section className="flex flex-row gap-1 justify-center">
            {(products as Product[])
              ?.sort((a, b) => a.prices[0].unitAmount - b.prices[0].unitAmount)
              .map((product, i) => (
                <ProductCard
                  key={`product_${i}`}
                  {...{ product, interval: toggled ? "year" : "month" }}
                />
              ))}
          </section>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No products yet created</CardTitle>
          </CardHeader>
          <CardContent>
            No products found. If you wish to quickly create some products,
            click the button below. Otherwise, make sure to add products in your
            Stripe dashboard.
          </CardContent>
          <CardFooter>
            <AutoButton action={api.addSampleProducts} />
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

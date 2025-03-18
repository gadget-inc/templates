import { useMemo } from "react";
import { api } from "../api";
import type { Product } from "../routes/_user.billing";
import { useNavigate, useOutletContext } from "react-router";
import { AuthOutletContext } from "@/routes/_user";
import { AutoButton } from "./auto";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

type ProductCardProps = {
  product: Product;
  interval: string;
};

const ProductCard = ({
  product: { prices, name },
  interval,
}: ProductCardProps) => {
  const { user } = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();

  const updateEval = useMemo(
    () =>
      user?.stripeSubscription?.status == "active" && user?.stripeCustomerId,
    [user]
  );

  return (
    <Card className="flex flex-col flex-1 max-w-sm rounded-lg border border-gray-200 shadow-lg bg-white p-6 transition-all hover:shadow-xl">
      {prices.map((price, i) => {
        if (price.interval === interval)
          return (
            <div key={i} className="space-y-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {name}
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  <span className="text-xl font-bold text-gray-900">
                    ${price.unitAmount / 100}
                  </span>{" "}
                  / {price.interval}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col justify-center text-gray-700 text-sm divide-y divide-gray-200 text-center">
                  <li className="py-2">Feature 1</li>
                  <li className="py-2">Feature 2</li>
                  <li className="py-2">Feature 3</li>
                </ul>
              </CardContent>
              <CardFooter>
                <AutoButton
                  className={`w-full rounded-md py-2 px-4 font-medium transition-colors ${
                    price.current
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                  action={
                    updateEval
                      ? api.updateSubscription
                      : api.createCheckoutSession
                  }
                  variables={{
                    priceId: price.id,
                    subscriptionId: updateEval
                      ? user.stripeSubscription.stripeId
                      : undefined,
                  }}
                  onSuccess={({ data }) => {
                    if (updateEval) navigate("/");
                    else window.location.href = data;
                  }}
                  disabled={price.current}
                >
                  {price.current ? "Current" : "Select"}
                </AutoButton>
              </CardFooter>
            </div>
          );
      })}
    </Card>
  );
};

export default ProductCard;

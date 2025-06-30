import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useActionForm } from "@gadgetinc/react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router";
import { api } from "../api";
import type { RootOutletContext } from "../root";

export default function () {
  const { gadgetConfig } = useOutletContext<RootOutletContext>();
  const navigate = useNavigate();
  const {
    register,
    submit,
    formState: { errors, isSubmitting },
  } = useActionForm(api.user.signIn, {
    onSuccess: () =>
      navigate(gadgetConfig.authentication!.redirectOnSuccessfulSignInPath!),
  });
  const { search } = useLocation();

  return (
    <div className="w-[420px]">
      <div className="space-y-8">
        <Card className="p-8">
          <form onSubmit={submit}>
            <div className="space-y-6">
              <h1 className="text-3xl font-bold tracking-tight">Login</h1>
              <Button variant="outline" size="lg" className="w-full" asChild>
                <a href={`/auth/google/start${search}`}>
                  <img
                    className="mr-2 h-4 w-4"
                    src="https://assets.gadget.dev/assets/default-app-assets/google.svg"
                    alt="Google logo"
                  />
                  Continue with Google
                </a>
              </Button>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      autoComplete="off"
                      {...register("email")}
                      className={
                        errors?.user?.email?.message ? "border-destructive" : ""
                      }
                    />
                    {errors?.user?.email?.message && (
                      <p className="text-sm text-destructive">
                        {errors.user.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="off"
                      {...register("password")}
                      className={
                        errors?.user?.password?.message
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {errors?.user?.password?.message && (
                      <p className="text-sm text-destructive">
                        {errors.user.password.message}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                  type="submit"
                >
                  Continue with email
                </Button>
                {errors?.root?.message && (
                  <p className="text-sm text-destructive">
                    {errors.root.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Forgot your password?{" "}
                  <Link
                    to="/forgot-password"
                    className="text-primary hover:underline font-medium"
                  >
                    Reset password
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </Card>
        <p className="text-sm text-muted-foreground text-center mt-4">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="text-primary hover:underline font-medium"
          >
            Get started →
          </Link>
        </p>
      </div>
    </div>
  );
}

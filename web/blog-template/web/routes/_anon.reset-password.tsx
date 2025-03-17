import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionForm } from "@gadgetinc/react";
import { CheckCircle } from "lucide-react";
import { Link, useLocation, useOutletContext } from "react-router";
import { api } from "../api";
import type { RootOutletContext } from "../root";

export default function () {
  const location = useLocation();
  const { gadgetConfig } = useOutletContext<RootOutletContext>();

  const {
    submit,
    register,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.resetPassword, {
    defaultValues: {
      code: new URLSearchParams(location.search).get("code"),
      password: "",
      confirmPassword: "",
    },
  });

  return isSubmitSuccessful ? (
    <Alert className="bg-green-50 text-green-900 border-green-200">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription>
        Password reset successfully.{" "}
        <Link
          to={gadgetConfig.authentication!.signInPath}
          className="font-medium text-green-900 hover:underline"
        >
          Sign in now
        </Link>
      </AlertDescription>
    </Alert>
  ) : (
    <>
      <Card className="p-8">
        <form onSubmit={submit}>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Reset Password
            </h1>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    type="password"
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
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="off"
                    {...register("confirmPassword")}
                    className={
                      errors?.confirmPassword?.message
                        ? "border-destructive"
                        : ""
                    }
                  />
                  {errors?.confirmPassword?.message && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              {errors?.root?.message && (
                <p className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}
              <Button
                className="w-full"
                size="lg"
                disabled={isSubmitting}
                type="submit"
              >
                Reset password
              </Button>
            </div>
          </div>
        </form>
      </Card>
      <p className="text-sm text-muted-foreground text-center mt-4">
        Remembered your password?{" "}
        <Link
          to="/sign-in"
          className="text-primary hover:underline font-medium"
        >
          Login →
        </Link>
      </p>
    </>
  );
}

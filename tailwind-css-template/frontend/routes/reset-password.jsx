import { useActionForm, useAuth } from "@gadgetinc/react";
import { api } from "../api";
import { useLocation, Link } from "react-router-dom";

export default function () {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const {
    submit,
    register,
    watch,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.resetPassword, {
    defaultValues: { code: params.get("code") },
  });
  const { configuration } = useAuth();

  return isSubmitSuccessful ? (
    <p className="first-letter:capitalize text-[green]">
      Password reset successfully. <Link to={configuration.signInPath}>Sign in now</Link>
    </p>
  ) : (
    <form className="flex gap-3 flex-col max-w-[350px] w-full" onSubmit={submit}>
      <h1 className="text-2xl font-semibold mb-0 pb-2">Reset password</h1>
      <input className="text-base py-1 px-3 border border-[#CCC] border-solid rounded w-full" placeholder="New password" type="password" {...register("password")} />
      {errors?.user?.password?.message && <p className="first-letter:capitalize text-[red]">{errors?.user?.password?.message}</p>}
      <input
        className="text-base py-1 px-3 border border-[#CCC] border-solid rounded w-full"
        placeholder="Confirm password"
        type="password"
        {...register("confirmPassword", {
          validate: (value) => value === watch("password") || "The passwords do not match",
        })}
      />
      {errors?.confirmPassword?.message && <p className="first-letter:capitalize text-[red]">{errors.confirmPassword.message}</p>}
      {errors?.root?.message && <p className="first-letter:capitalize text-[red]">{errors.root.message}</p>}
      <button disabled={isSubmitting} type="submit" className="py-0.5 border border-solid border-black rounded bg-[#efefef] hover:bg-[#e5e5e5]">
        Reset password
      </button>
    </form>
  );
}

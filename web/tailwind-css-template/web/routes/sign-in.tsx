import { useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { Link, useLocation } from "react-router-dom";
import { GoogleOAuthButton } from "../components";

export default function () {
  const {
    register,
    submit,
    formState: { errors, isSubmitting },
  } = useActionForm(api.user.signIn);
  const { search } = useLocation();

  return (
    <form className="flex gap-3 flex-col max-w-[350px] w-full" onSubmit={submit}>
      <h1 className="text-2xl font-semibold mb-0 pb-2e">Sign in</h1>
      <div className="flex gap-3 flex-col max-w-[350px] w-full">
        <GoogleOAuthButton search={search} />
        <input className="text-base py-1 px-3 border border-[#CCC] border-solid rounded w-full" placeholder="Email" {...register("email")} />
        <input className="text-base py-1 px-3 border border-[#CCC] border-solid rounded w-full" placeholder="Password" type="password" {...register("password")} />
        {errors?.root?.message && <p className="first-letter:capitalize text-[red]">{errors.root.message}</p>}
        <button className="py-0.5 border border-solid border-black rounded-sm bg-[#efefef] hover:bg-[#e5e5e5]" disabled={isSubmitting} type="submit">
          Sign in
        </button>
        <p>
          Forgot your password? <Link className="underline text-[#0000ee]" to="/forgot-password">Reset password</Link>
        </p>
      </div>
    </form>
  );
}

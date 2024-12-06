import { useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { useLocation } from "react-router-dom";
import { GoogleOAuthButton } from "../components";

export default function () {
  const {
    register,
    submit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.signUp);
  const { search } = useLocation();

  return (
    <form className="flex gap-3 flex-col max-w-[350px] w-full" onSubmit={submit}>
      <h1 className="text-2xl font-semibold mb-0 pb-2">Create account</h1>
      <div className="flex gap-3 flex-col max-w-[350px] w-full">
        <GoogleOAuthButton search={search} />
        <input className="text-base py-1 px-3 border border-[#CCC] border-solid rounded w-full" placeholder="Email" {...register("email")} />
        {errors?.user?.email?.message && <p className="first-letter:capitalize text-[red]">Email: {errors.user.email.message}</p>}
        <input className="ctext-base py-1 px-3 border border-[#CCC] border-solid rounded w-full" placeholder="Password" type="password" {...register("password")} />
        {errors?.user?.password?.message && <p className="first-letter:capitalize text-[red]">Password: {errors.user.password.message}</p>}
        {errors?.root?.message && <p className="first-letter:capitalize text-[red]">{errors.root.message}</p>}
        {isSubmitSuccessful && <p className="first-letter:capitalize text-[green]">Please check your inbox</p>}
        <button className="py-0.5 border border-solid border-black rounded bg-[#efefef] hover:bg-[#e5e5e5]" disabled={isSubmitting} type="submit">
          Sign up
        </button>
      </div>
    </form>
  );
}

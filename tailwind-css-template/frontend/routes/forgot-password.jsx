import { useActionForm } from "@gadgetinc/react";
import { api } from "../api";

export default function () {
  const {
    submit,
    register,
    formState: { isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.sendResetPassword);

  return isSubmitSuccessful ? (
    <p className="first-letter:capitalize text-[green]">Email has been sent. Please check your inbox.</p>
  ) : (
    <form className="flex gap-3 flex-col max-w-[350px] w-full" onSubmit={submit}>
      <h1 className="text-2xl font-semibold mb-0 pb-2">Reset password</h1>
      <input className="text-base py-1 px-3 border border-[#CCC] border-solid rounded w-full" placeholder="Email" {...register("email")} />
      <button className="py-0.5 border border-solid border-black rounded-sm bg-[#efefef] hover:bg-[#e5e5e5]" disabled={isSubmitting} type="submit">
        Send reset link
      </button>
    </form>
  );
}

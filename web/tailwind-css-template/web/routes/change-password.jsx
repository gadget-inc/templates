import { useUser, useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { Link } from "react-router-dom";

export default function () {
  const user = useUser(api);
  const {
    submit,
    register,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.changePassword, { defaultValues: user });

  return isSubmitSuccessful ? (
    <p className="first-letter:capitalize text-[green]">
      Password changed successfully. <Link to="/signed-in">Back to profile</Link>
    </p>
  ) : (
    <form className="flex gap-3 flex-col max-w-[350px] w-full" onSubmit={submit}>
      <h1 className="text-2xl font-semibold mb-0 pb-2">Change password</h1>
      <input className="text-base py-1 px-3 border border-[#CCC] border-solid rounded w-full" type="password" placeholder="Current password" {...register("currentPassword")} />
      <input className="text-base py-1 px-3 border border-[#CCC] border-solid rounded w-full" type="password" placeholder="New password" {...register("newPassword")} />
      {errors?.user?.password?.message && <p className="first-letter:capitalize text-[red]">Password: {errors.user.password.message}</p>}
      {errors?.root?.message && <p className="first-letter:capitalize text-[red]">{errors.root.message}</p>}
      <Link className="underline text-[#0000ee]" to="/signed-in">Back to profile</Link>
      <button className="py-0.5 border border-solid border-black rounded-sm bg-[#efefef] hover:bg-[#e5e5e5]" disabled={isSubmitting} type="submit">
        Change password
      </button>
    </form>
  );
}

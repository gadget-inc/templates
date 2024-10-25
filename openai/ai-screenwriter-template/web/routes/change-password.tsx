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
    <p className="format-message success">
      Password changed successfully. <Link to="/signed-in">Back to profile</Link>
    </p>
  ) : (
    <form className="custom-form" onSubmit={submit}>
      <h1 className="form-title">Change password</h1>
      <input className="custom-input" type="password" placeholder="Current password" {...register("currentPassword")} />
      <input className="custom-input" type="password" placeholder="New password" {...register("newPassword")} />
      {errors?.user?.password?.message && <p className="format-message error">Password: {errors.user.password.message}</p>}
      {errors?.root?.message && <p className="format-message error">{errors.root.message}</p>}
      <Link to="/signed-in">Back to profile</Link>
      <button disabled={isSubmitting} type="submit">
        Change password
      </button>
    </form>
  );
}

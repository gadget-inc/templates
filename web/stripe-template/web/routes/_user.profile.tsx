import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionForm } from "@gadgetinc/react";
import { useState } from "react";
import { useOutletContext } from "react-router";
import { api } from "../api";
import type { AuthOutletContext } from "./_user";

export default function () {
  const { user } = useOutletContext<AuthOutletContext>();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const hasName = user.firstName || user.lastName;
  const title = hasName ? `${user.firstName} ${user.lastName}` : user.email;
  const initials = hasName
    ? (user.firstName?.slice(0, 1) ?? "") + (user.lastName?.slice(0, 1) ?? "")
    : "";

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="rounded-lg shadow p-6 bg-background border">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profilePicture?.url} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              {hasName && <p className="text-gray-600">{user.email}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            {!user.googleProfileId && (
              <Button
                variant="ghost"
                onClick={() => setIsChangingPassword(true)}
              >
                Change password
              </Button>
            )}
            <Button variant="ghost" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>
        </div>
      </div>
      <EditProfileModal open={isEditing} onClose={() => setIsEditing(false)} />
      <ChangePasswordModal
        open={isChangingPassword}
        onClose={() => setIsChangingPassword(false)}
      />
    </div>
  );
}

const EditProfileModal = (props: { open: boolean; onClose: () => void }) => {
  const { user } = useOutletContext<AuthOutletContext>();
  const {
    register,
    submit,
    formState: { isSubmitting },
  } = useActionForm(api.user.update, {
    defaultValues: user,
    onSuccess: props.onClose,
    send: ["firstName", "lastName"],
  });

  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="space-y-4">
            <div>
              <Label>First Name</Label>
              <Input placeholder="First name" {...register("firstName")} />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input placeholder="Last name" {...register("lastName")} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={props.onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ChangePasswordModal = (props: { open: boolean; onClose: () => void }) => {
  const { user } = useOutletContext<AuthOutletContext>();
  const {
    register,
    submit,
    reset,
    formState: { errors, isSubmitting },
  } = useActionForm(api.user.changePassword, {
    defaultValues: user,
    onSuccess: props.onClose,
  });

  const onClose = () => {
    reset();
    props.onClose();
  };

  return (
    <Dialog open={props.open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input
                type="password"
                autoComplete="off"
                {...register("currentPassword")}
              />
              {errors?.root?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.root.message}
                </p>
              )}
            </div>
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                autoComplete="off"
                {...register("newPassword")}
              />
              {errors?.user?.password?.message && (
                <p className="text-red-500 text-sm mt-1">
                  New password {errors.user.password.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

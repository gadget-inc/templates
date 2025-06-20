import { AutoTable } from "@/components/auto";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAction, useActionForm } from "@gadgetinc/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../api";

export default function () {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [_, resendInvite] = useAction(api.invite.resend);

  const handleResendInvite = async (id: string) => {
    const { error } = await resendInvite({ id });
    if (error) {
      toast.error("Failed to resend invite");
    } else {
      toast.success("Invite resent");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Invite team</h1>
          <Button onClick={() => setShowInviteModal(true)}>Invite</Button>
        </div>

        <Card className="p-4 flex flex-col h-[70vh]">
          <AutoTable
            model={api.invite}
            selectable={false}
            columns={[
              "email",
              { header: "Sent at", field: "updatedAt" },
              {
                header: "",
                render: ({ record }) => (
                  <Button
                    variant="ghost"
                    className="hover:underline"
                    onClick={() => handleResendInvite(record.id as string)}
                  >
                    Resend invite
                  </Button>
                ),
              },
            ]}
          />
        </Card>
      </div>

      <InviteModal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </div>
  );
}

const InviteModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const {
    register,
    submit,
    formState: { isSubmitting },
  } = useActionForm(api.invite.create, {
    onSuccess: onClose,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              {...register("email")}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Send invite
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

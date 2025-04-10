import { AutoTable } from "@/components/auto";
import { Card } from "@/components/ui/card";
import { api } from "../api";

export default function () {
  return (
    <div className="container mx-auto p-6 z-10 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Team</h1>

      <Card className="p-4 flex flex-col h-[70vh]">
        <AutoTable
          model={api.user}
          selectable={false}
          columns={["firstName", "lastName", "email", "emailVerified", "roles"]}
        />
      </Card>
    </div>
  );
}

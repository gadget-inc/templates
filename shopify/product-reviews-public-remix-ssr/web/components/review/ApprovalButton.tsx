import { Button } from "@shopify/polaris";
import { api } from "../../api";
import { useAction } from "@gadgetinc/react";
import { useEffect } from "react";

export default ({
  record: { id, approved },
  toast,
}: {
  record: { id: string; approved: boolean };
  toast?: {
    show(message: string, opts?: any): string;
    hide(id: string): void;
  };
}) => {
  const [{ data, fetching, error }, run] = useAction(api.review.update);

  useEffect(() => {
    if (!fetching && data) {
      toast?.show(
        data.approved ? "Review added to store" : "Review removed from store",
        {
          duration: 5000,
        }
      );
    }
  }, [data, fetching]);

  useEffect(() => {
    if (!fetching && error)
      toast?.show("Error submitting change", {
        duration: 5000,
        isError: true,
      });
  }, [error, fetching]);

  return (
    <Button
      onClick={() => run({ id, approved: !approved })}
      loading={fetching}
      disabled={fetching}
      variant="secondary"
      tone={approved ? "critical" : undefined}
    >
      {approved ? "Remove" : "Approve"}
    </Button>
  );
};

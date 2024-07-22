import { useAction } from "@gadgetinc/react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";

export default () => {
  const [params] = useSearchParams();

  const [_, confirm] = useAction(api.appointment.confirm);

  useEffect(() => {
    const run = async () => {
      await confirm({ id: params.get("appointment"), confirmed: true });
    };

    run();
  }, []);

  return <h2>Thanks for confirming your appointment!</h2>;
};

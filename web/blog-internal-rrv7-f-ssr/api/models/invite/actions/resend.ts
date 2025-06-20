import { applyParams, save, generateCode, hashCode, ActionOptions } from "gadget-server";
import { sendInviteEmail } from '../utils/emails';

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  applyParams(params, record);
  const code = generateCode();
  (record as any).code = code;
  record.inviteToken = hashCode(code);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, connections }) => {
  await sendInviteEmail(record.email, (record as any).code as string);
};

export const options: ActionOptions = {
  actionType: "update",
};

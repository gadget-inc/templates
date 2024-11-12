import renderEmail from "../utilities/renderEmail";

export const run: ActionRun = async ({
  params,
  logger,
  api,
  connections,
  emails,
  currentAppUrl,
}) => {
  const { singleUseCode, email } = params;

  if (!email || !singleUseCode) throw new Error("Missing required params");

  await emails.sendMail({
    to: email,
    subject: "Review your purchase",
    html: await renderEmail({ currentAppUrl, singleUseCode }),
  });
};

export const params = {
  email: {
    type: "string",
  },
  singleUseCode: {
    type: "string",
  },
};

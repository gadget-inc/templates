import renderEmail from "../utilities/renderEmail";


export const run: ActionRun = async ({
  params,
  logger,
  api,
  connections,
  emails,
  currentAppUrl,
}) => {
  const { singleUseCode, email, orderId } = params;

  if (!email || !singleUseCode || !orderId)
    throw new Error("Missing required params");

  await emails.sendMail({
    to: email,
    subject: "Review your purchase",
    html: await renderEmail({ currentAppUrl, singleUseCode }),
  });

  // Clear the field so we don't send the email again
  await api.internal.shopifyOrder.update(orderId, {
    requestReviewAfter: null,
  });
};

export const params = {
  email: {
    type: "string",
  },
  singleUseCode: {
    type: "string",
  },
  orderId: {
    type: "string",
  },
};

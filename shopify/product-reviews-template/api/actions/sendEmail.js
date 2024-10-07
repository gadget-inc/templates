import { SendEmailGlobalActionContext } from "gadget-server";
import React from "react";
import { render } from "@react-email/render";
import { Container, Button } from "@react-email/components";

/**
 * @param { SendEmailGlobalActionContext } context
 */
export async function run({
  params,
  logger,
  api,
  connections,
  emails,
  currentAppUrl,
}) {
  const { singleUseCode, email } = params;

  await emails.sendMail({
    to: email,
    subject: "Review your purchase",
    html: await render(
      <Container>
        {/* Add more text in here */}
        <Button
          href={`${currentAppUrl}/review/${singleUseCode}`}
          style={{ color: "#61dafb", padding: "10px 20px" }}
        >
          Review
        </Button>
      </Container>
    ),
  });
}

export const params = {
  email: {
    type: "string",
  },
  singleUseCode: {
    type: "string",
  },
};

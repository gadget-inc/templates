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
  const { id, products, email, orderNumber } = params;

  await emails.sendMail({
    to: email,
    subject: `Review your purchase${products.length > 1 ? "s" : ""}`,
    html: await render(
      <Container>
        {/* Add more text in here */}
        <Button
          href={`${currentAppUrl}/${id}?products=${products.join(
            ","
          )}&orderNumber=${orderNumber}`}
          style={{ color: "#61dafb", padding: "10px 20px" }}
        >
          Review
        </Button>
      </Container>
    ),
  });
}

export const params = {
  id: {
    type: "string",
  },
  products: {
    type: "array",
    items: {
      type: "string",
    },
  },
  email: {
    type: "string",
  },
  orderNumber: {
    type: "number",
  },
};

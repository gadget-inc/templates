import React from "react";
import { render } from "@react-email/render";
import { Container, Button } from "@react-email/components";
import { logger } from "gadget-server";

export default async ({
  singleUseCode,
  currentAppUrl,
}: {
  singleUseCode: string;
  currentAppUrl: string;
}) => {
  logger.info({ singleUseCode, currentAppUrl }, "HERE");

  return await render(
    <Container>
      {/* Add more text in here */}
      {/* Email written with React-Email: https://react.email/components */}
      <Button
        href={`${currentAppUrl}review/${singleUseCode}`}
        style={{ color: "#61dafb", padding: "10px 20px" }}
      >
        Review
      </Button>
    </Container>
  );
};
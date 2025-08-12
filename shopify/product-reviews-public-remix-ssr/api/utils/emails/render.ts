import React from "react";
import { render } from "@react-email/render";
import { Container, Button } from "@react-email/components";

// This file is used to render the email content for sending review requests.
export default async ({
  reviewToken,
  currentAppUrl,
}: {
  reviewToken: string;
  currentAppUrl: string;
}) => {
  return await render(
    <Container>
      {/* Add more text in here */}
      {/* Email written with React-Email: https://react.email/components */}
      <Button
        href={`${currentAppUrl}review/${reviewToken}`}
        style={{ color: "#61dafb", padding: "10px 20px" }}
      >
        Review
      </Button>
    </Container>
  );
};

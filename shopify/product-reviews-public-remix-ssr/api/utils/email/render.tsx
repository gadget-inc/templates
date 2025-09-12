import React from "react";
import { render } from "@react-email/render";
import {
  Container,
  Button,
  Head,
  Html,
  Body,
  Section,
  Text,
  Heading,
  Hr,
} from "@react-email/components";

// This file is used to render the email content for sending review requests.
export default async ({
  reviewToken,
  shopDomain,
}: {
  reviewToken: string;
  shopDomain: string | undefined | null;
}) => {
  return await render(
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Thank you for your purchase! 🎉</Heading>
          </Section>

          <Section style={content}>
            <Text style={text}>
              We hope you're loving your recent purchase! Your experience
              matters to us, and we'd be incredibly grateful if you could take a
              moment to share your thoughts.
            </Text>

            <Text style={text}>
              Your review helps other customers make informed decisions and
              helps us continue improving our products and service.
            </Text>

            <Section style={buttonContainer}>
              <Button
                /**
                 * Make sure to change the subpath to the key in your toml
                 * URL format: https://${shopDomain}/</<subpath_prefix>/<subpath>/review/${reviewToken}
                 */
                href={`https://${shopDomain}/apps/product-reviews/review/${reviewToken}`}
                style={button}
              >
                Write a Review
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={footerText}>
              <strong>Why your review matters:</strong>
            </Text>
            <Text style={listItem}>
              • Helps other customers discover great products
            </Text>
            <Text style={listItem}>
              • Provides valuable feedback to help us improve
            </Text>
            <Text style={listItem}>
              • Takes less than 2 minutes to complete
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Email styling
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 24px 0",
  textAlign: "center" as const,
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 8px",
  padding: "0",
};

const content = {
  padding: "0 24px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
  border: "none",
  cursor: "pointer",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footerText = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "16px 0",
};

const listItem = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
  paddingLeft: "16px",
};

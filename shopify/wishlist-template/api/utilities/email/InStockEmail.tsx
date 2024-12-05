import {
  Container,
  Html,
  Section,
  Text,
  Row,
  Button,
} from "@react-email/components";
import React, { type CSSProperties } from "react";

const container: CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "40px 20px",
  maxWidth: "600px",
  margin: "0 auto",
  textAlign: "center",
};

const text: CSSProperties = {
  fontSize: "16px",
  color: "#666666",
  lineHeight: "1.5",
};

const button: CSSProperties = {
  backgroundColor: "#ff6f61",
  color: "#ffffff",
  padding: "10px 20px",
  borderRadius: "5px",
  textDecoration: "none",
  display: "inline-block",
  margin: "20px 0",
  fontSize: "16px",
};

const footerText: CSSProperties = {
  fontSize: "14px",
  color: "#999999",
  marginTop: "30px",
};

export default ({
  productTitle,
  title,
  variantURL,
  name,
}: {
  productTitle: string;
  title: string;
  variantURL: string;
  name: string;
}) => {
  return (
    <Html>
      <Container style={container}>
        <Section>
          <Row>
            <Text style={text}>
              {productTitle}
              {title !== "Default Title" && ` - ${title}`} is available again!
              Don't miss out — get it before it's gone again.
            </Text>
          </Row>
          <Row>
            <Button href={variantURL} target="_blank" style={button}>
              Buy now
            </Button>
          </Row>
          <Row>
            <Text>
              Thank you for being a valued customer. We hope this item brings
              you joy!
            </Text>
          </Row>
          <Row>
            <Text style={footerText}>Thanks for shopping with {name}</Text>
          </Row>
        </Section>
      </Container>
    </Html>
  );
};

import {
  Html,
  Section,
  Text,
  Heading,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";

export default ({
  heading,
  name,
  body,
  button,
  currentAppUrl,
  appointmentId,
}) => {
  return (
    <Html>
      {heading && (
        <>
          <Heading>{heading}</Heading>
          <Hr />
        </>
      )}
      <Section>
        <Text>Hello {name},</Text>
        <Text>{body}</Text>
        {button && (
          <Button
            href={`${currentAppUrl}confirmation?appointment=${appointmentId}`}
            target="_blank"
          >
            Confirm
          </Button>
        )}
        <Text>Thank you for using Gadget!</Text>
      </Section>
    </Html>
  );
};

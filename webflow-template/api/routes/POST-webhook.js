import { render } from "@react-email/render";
import { RouteContext, emails } from "gadget-server";
import * as React from "react";
import Email from "../utilities/Email";

/**
 * Route handler for GET hello
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({
  request,
  reply,
  api,
  logger,
  connections,
}) {
  const { name, email, store } = request.body;

  if (!name || !email || !store) throw new Error("Missing required field(s)");

  await api.appointment.create({
    name,
    email,
    store,
  });

  await emails.sendMail({
    to: email,
    subject: "Appointment request received!",
    html: render(
      <Email
        {...{
          heading: "Request received",
          name,
          body: `We have recieved your request for an appointment at ${store}. We will get back to you shortly to confirm the appointment date and time.`,
        }}
      />
    ),
  });

  await reply.code(200).send();
}

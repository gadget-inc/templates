import { applyParams, save, ActionOptions, UpdateAppointmentActionContext } from "gadget-server";

/**
 * @param { UpdateAppointmentActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { UpdateAppointmentActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  if (record.changed("date")) {
    await emails.sendMail({
      to: record.email,
      subject: "Appointment date",
      html: render(
        <Email
          {...{
            heading: "An appointment date has been set",
            name: record.name,
            body: `The proposed date for your appointment at ${record.store} is ${DateTime.fromJSDate(record.date).toFormat("MMMM d, yyyy h:mm a")}. Please confirm if this works for you.`,
            currentAppUrl,
            appointmentId: record.id,
          }}
          button
        />
      ),
    });
  }
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};

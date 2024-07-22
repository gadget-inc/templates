import { useUser } from "@gadgetinc/react";
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";
import AppointmentCard from "../components/AppointmentCard";
import "./signed-in.css";

export default function () {
  const user = useUser(api);

  const [{ data: appointments }] = useFindMany(api.appointment, {
    select: {
      id: true,
      date: true,
      store: true,
      name: true,
      email: true,
      confirmed: true,
    },
    live: true,
  });

  return user ? (
    <>
      <h1>Appointments</h1>
      <div id="appointments-card-div">
        {appointments?.map(({ id, name, store, email, date, confirmed }) => (
          <AppointmentCard
            key={id}
            {...{ id, name, store, email, date, confirmed }}
          />
        ))}
      </div>
    </>
  ) : null;
}

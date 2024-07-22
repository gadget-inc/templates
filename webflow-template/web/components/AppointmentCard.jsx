import { useAction } from "@gadgetinc/react";
import { useCallback, useState } from "react";
import DatePicker from "react-datepicker";
import { api } from "../api";
import "react-datepicker/dist/react-datepicker.css";
import CheckboxIcon from "../icons/checkmark-icon.svg";
import "./AppointmentCard.css";
import { DateTime } from "luxon";

const DATE_FORMAT = "MMMM d, yyyy h:mm a";

export default ({ id, name, store, email, date, confirmed }) => {
  const [selectedDate, setSelectedDate] = useState(date);

  const [_, updateAppointment] = useAction(api.appointment.update);

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
  });

  const handleSave = useCallback(async () => {
    if (selectedDate && selectedDate != date) {
      await updateAppointment({ id, date: selectedDate });
    }
  }, [id, selectedDate]);

  return (
    <div className="appointment-card">
      <h2>{name}</h2>
      {date && confirmed ? (
        <div className="appointment-card-date-section">
          <span>{DateTime.fromJSDate(date).toFormat(DATE_FORMAT)}</span>
          <img src={CheckboxIcon} alt="Confirmed" />
        </div>
      ) : (
        <div className="datepicker-div">
          <DatePicker
            selected={selectedDate || date}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat={DATE_FORMAT}
          />
          <button
            className="datepicker-save-button"
            disabled={date == selectedDate}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}
      <div>Email: {email}</div>
      <div>Store: {store}</div>
    </div>
  );
};

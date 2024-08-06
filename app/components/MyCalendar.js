// app/components/MyCalendar.js

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styled from "styled-components";

const localizer = momentLocalizer(moment);

const Container = styled.div`
  margin: 5px;
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px;
  background-color: #81d293;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font: "Inter";

  &:hover {
    background-color: #87cefa;
    box-shadow: 0px 2px 5px rgba(34, 100, 230, 0.12);
  }
`;

const MyCalendar = ({ events, eventStyleGetter }) => (
  <Container>
    <div className="flex-1">
      <h1>Bus Schedule Management</h1>
      <Button onClick={() => alert("Add new schedule")}>
        Add New Schedule
      </Button>
    </div>
    <div className="flex-1">
      <Calendar
        localizer={localizer}
        events={events.map((trip) => ({
          title: `${trip.trip_name} (${trip.destination})`,
          start: trip.start,
          end: trip.end,
          vehicle_id: trip.vehicle_id,
          driver_id: trip.driver_id,
          note: trip.note,
          pickup: trip.pickup,
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  </Container>
);

export default MyCalendar;

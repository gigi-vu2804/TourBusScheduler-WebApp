// app/trips/calendar/page.js
"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useUserAuth } from "../../_utils/auth-context";
import { getTrips } from "../../_services/trip-services";
import { getDrivers } from "../../_services/driver-services"; // Import driver services
import { getBuses } from "../../_services/bus-services"; // Import bus services
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/en-ca";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: #ffffff;
  min-height: 100vh;
  width: 100%;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 10px;
`;

const Tooltip = styled.div`
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #333;
`;

export default function CalendarPage() {
  const { user } = useUserAuth();
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState({});
  const [buses, setBuses] = useState({});
  const [error, setError] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tripData = await getTrips();
        const driverData = await getDrivers();
        const busData = await getBuses();

        // Create maps for quick lookup
        const driverMap = driverData.reduce((acc, driver) => {
          acc[driver.id] = `${driver.first_name} ${driver.last_name}`;
          return acc;
        }, {});

        const busMap = busData.reduce((acc, bus) => {
          acc[bus.id] = bus.license_plate;
          return acc;
        }, {});

        setTrips(tripData);
        setDrivers(driverMap);
        setBuses(busMap);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };
    fetchData();
  }, [user]);

  const eventStyleGetter = (event) => {
    const backgroundColor = getColorByVehicleId(event.vehicle_id);
    const style = {
      backgroundColor,
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };
    return {
      style,
    };
  };

  const getColorByVehicleId = (vehicle_id) => {
    const colors = [
      "#1e90ff", // Blue
      "#ff7f50", // Coral
      "#32cd32", // LimeGreen
      "#ffa500", // Orange
      "#ff69b4", // HotPink
      "#ba55d3", // MediumOrchid
    ];
    const index = vehicle_id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleEventClick = (event, e) => {
    setTooltip({
      top: e.clientY,
      left: e.clientX,
      details: event,
    });
  };

  const handleEventClose = () => {
    setTooltip(null);
  };

  return (
    <MainContainer>
      <Header>
        <Title>Trips Calendar</Title>
      </Header>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Calendar
        localizer={localizer}
        events={trips.map((trip) => ({
          title: trip.trip_name,
          pickup: trip.pickup,
          destination: trip.destination,
          client: trip.client_name,
          start: new Date(trip.start_time),
          end: new Date(trip.end_time),
          vehicle_id: trip.vehicle_id,
          driver_id: trip.driver_id,
          note: trip.note,
          allDay: false,
          driver_name: drivers[trip.driver_id] || "Unknown Driver",
          vehicle_plate: buses[trip.vehicle_id] || "Unknown Plate",
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, width: "100%" }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event, e) => handleEventClick(event, e.nativeEvent)}
        onDoubleClickEvent={handleEventClose}
        selectable
        views={["month", "week", "day", "agenda"]}
        tooltipAccessor={() => null}
        onMouseLeave={handleEventClose}
        defaultView={Views.MONTH}
        step={60}
        showMultiDayTimes
        toolbar
      />
      {tooltip && (
        <Tooltip style={{ top: tooltip.top + 10, left: tooltip.left + 10 }}>
          <CloseButton onClick={handleEventClose}>&times;</CloseButton>
          <div>
            <strong>Trip name:</strong> {tooltip.details.title}
          </div>
          <div>
            <strong>Destination:</strong> {tooltip.details.destination}
          </div>
          <div>
            <strong>Pickup:</strong> {tooltip.details.pickup}
          </div>
          <div>
            <strong>Driver:</strong> {tooltip.details.driver_name}
          </div>
          <div>
            <strong>Vehicle Plate:</strong> {tooltip.details.vehicle_plate}
          </div>
          <div>
            <strong>Start:</strong>{" "}
            {moment(tooltip.details.start).format("MMMM Do YYYY, h:mm:ss a")}
          </div>
          <div>
            <strong>End:</strong>{" "}
            {moment(tooltip.details.end).format("MMMM Do YYYY, h:mm:ss a")}
          </div>
          <div>
            <strong>Note:</strong> {tooltip.details.note}
          </div>
        </Tooltip>
      )}
    </MainContainer>
  );
}

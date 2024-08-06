// app/trips/view/page.js
"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUserAuth } from "../../_utils/auth-context";
import {
  getTrips,
  exportTripsToCSV,
  exportTripsToExcel,
} from "../../_services/trip-services";
import { getDrivers } from "../../_services/driver-services";
import { getBuses } from "../../_services/bus-services";

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  margin-left: 60px;
  background-color: #ffffff;
`;

const StyledButton = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  border-radius: 10px;
  cursor: pointer;
`;

const ExportButton = styled(StyledButton)`
  background-color: #007bff;
  margin-top: 10px;
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

const StyledTable = styled.table`
  width: 100%;
  max-width: 1000px;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 10px;
  border-bottom: 2px solid #4caf50;
  text-align: left;
  font-size: 18px;
  color: #364358;
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  font-size: 16px;
  color: #333;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 16px;
`;

export default function ViewTrips() {
  const { user } = useUserAuth();
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState({});
  const [buses, setBuses] = useState({});
  const [error, setError] = useState(null);

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

  const handleExportTripsExcel = async () => {
    try {
      const tripData = await getTrips();
      exportTripsToExcel(
        tripData.map((trip) => ({
          ...trip,
          vehicle_plate: buses[trip.vehicle_id] || "Unknown Plate",
          driver_name: drivers[trip.driver_id] || "Unknown Driver",
        }))
      );
    } catch (err) {
      console.error("Error exporting trips:", err);
    }
  };

  const handleExportTripsCSV = async () => {
    try {
      const tripData = await getTrips();
      exportTripsToCSV(
        tripData.map((trip) => ({
          ...trip,
          vehicle_plate: buses[trip.vehicle_id] || "Unknown Plate",
          driver_name: drivers[trip.driver_id] || "Unknown Driver",
        }))
      );
    } catch (err) {
      console.error("Error exporting trips:", err);
    }
  };

  return (
    <MainContainer>
      <Header>
        <Title>All Trips</Title>
      </Header>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <StyledTable>
        <thead>
          <tr>
            <TableCell>Trip Name</TableCell>
            <TableHeader>Pickup</TableHeader>
            <TableHeader>Destination</TableHeader>
            <TableHeader>Vehicle Plate</TableHeader>
            <TableHeader>Driver Name</TableHeader>
            <TableHeader>Client</TableHeader>
            <TableHeader>Start Time</TableHeader>
            <TableHeader>End Time</TableHeader>
            <TableHeader>Note</TableHeader>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              <TableCell>{trip.trip_name}</TableCell>
              <TableCell>{trip.pickup}</TableCell>
              <TableCell>{trip.destination}</TableCell>
              <TableCell>{buses[trip.vehicle_id]}</TableCell>
              <TableCell>{drivers[trip.driver_id]}</TableCell>
              <TableCell>{trip.client_name}</TableCell>
              <TableCell>
                {new Date(trip.start_time).toLocaleString()}
              </TableCell>
              <TableCell>{new Date(trip.end_time).toLocaleString()}</TableCell>
              <TableCell>{trip.note}</TableCell>
            </tr>
          ))}
        </tbody>
      </StyledTable>
      <ExportButton type="button" onClick={handleExportTripsExcel}>
        Download Trips (Excel)
      </ExportButton>
      <ExportButton type="button" onClick={handleExportTripsCSV}>
        Download Trips (CSV)
      </ExportButton>
    </MainContainer>
  );
}

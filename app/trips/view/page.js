// app/trips/view/page.js
"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUserAuth } from "../../_utils/auth-context";
import { getTrips, deleteTrip } from "../../_services/trip-services";
import { getDrivers } from "../../_services/driver-services";
import { getBuses } from "../../_services/bus-services";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import EditTripModal from "../../components/EditTripModal"; // Import the modal

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
  position: relative;
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const ActionIcon = styled.div`
  cursor: pointer;
  font-size: 18px;
  &:hover {
    color: #4caf50;
  }
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
  const [editingTrip, setEditingTrip] = useState(null); // State to track editing

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

  const handleEdit = (trip) => {
    setEditingTrip(trip); // Set the trip to edit
  };

  const handleDelete = (tripId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trip?"
    );
    if (confirmed) {
      deleteTrip(tripId)
        .then(() => {
          setTrips(trips.filter((trip) => trip.id !== tripId)); // Update state
          alert("Trip deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting trip:", error);
          setError("Failed to delete trip.");
        });
    }
  };

  const handleModalClose = () => {
    setEditingTrip(null); // Close the modal
  };

  const handleSave = (updatedTrip) => {
    // Update the trips state with the new trip data
    setTrips((prevTrips) =>
      prevTrips.map((trip) => (trip.id === updatedTrip.id ? updatedTrip : trip))
    );
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
            <TableHeader>Trip Name</TableHeader>
            <TableHeader>Pickup</TableHeader>
            <TableHeader>Destination</TableHeader>
            <TableHeader>Vehicle Plate</TableHeader>
            <TableHeader>Driver Name</TableHeader>
            <TableHeader>Client</TableHeader>
            <TableHeader>Start Time</TableHeader>
            <TableHeader>End Time</TableHeader>
            <TableHeader>Note</TableHeader>
            <TableHeader>Actions</TableHeader>
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
              <TableCell>
                <IconWrapper>
                  <ActionIcon onClick={() => handleEdit(trip)}>
                    <FaEdit />
                  </ActionIcon>
                  <ActionIcon onClick={() => handleDelete(trip.id)}>
                    <FaTrashAlt />
                  </ActionIcon>
                </IconWrapper>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </StyledTable>
      {editingTrip && (
        <EditTripModal
          trip={editingTrip}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </MainContainer>
  );
}

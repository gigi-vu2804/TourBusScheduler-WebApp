// app/trips/create/page.js
"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../../_utils/auth-context";
import { addTrip } from "../../_services/trip-services";
import { getDrivers } from "@/app/_services/driver-services";
import { getBuses } from "@/app/_services/bus-services";

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

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const TextArea = styled.textarea`
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
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

export default function CreateTrip() {
  const { user } = useUserAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    trip_name: "",
    destination: "",
    driver_id: "",
    start_time: "",
    end_time: "",
    pickup: "",
    client_name: "",
    vehicle_id: "",
    vehicle_plate: "",
    note: "",
  });
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const driverData = await getDrivers();
        setDrivers(driverData);
      } catch (err) {
        console.error("Error fetching drivers:", err);
        setError(err.message);
      }
    };

    const fetchBuses = async () => {
      try {
        const busData = await getBuses();
        setBuses(busData);
      } catch (err) {
        console.error("Error fetching buses:", err);
        setError(err.message);
      }
    };

    fetchDrivers();
    fetchBuses();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Format date strings in 'YYYY-MM-DDTHH:mm' format
      const formattedData = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString().slice(0, 16),
        end_time: new Date(formData.end_time).toISOString().slice(0, 16),
      };
      await addTrip(formattedData);
      router.push("/trips/view");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <MainContainer>
      <Header>
        <Title>Create New Trip</Title>
      </Header>
      <StyledForm onSubmit={handleSubmit}>
        <Input
          type="text"
          name="trip_name"
          placeholder="Name of this trip"
          value={formData.trip_name}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="pickup"
          placeholder="Pickup Location"
          value={formData.pickup}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
          required
        />
        <Select
          name="vehicle_id"
          value={formData.vehicle_id}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select a Vehicle
          </option>
          {buses.map((bus) => (
            <option key={bus.id} value={bus.id}>
              {`${bus.brand} ${bus.model}, ${bus.seat_capacity}-seater (${bus.license_plate})`}
            </option>
          ))}
        </Select>
        <Select
          name="driver_id"
          value={formData.driver_id}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select a Driver
          </option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {`${driver.first_name} ${driver.last_name} (${driver.id})`}
            </option>
          ))}
        </Select>
        <Input
          name="client_name"
          value={formData.client_name}
          onChange={handleChange}
          placeholder="Client Name"
          required
        />
        <Input
          type="datetime-local"
          name="start_time"
          placeholder="Start Time"
          value={formData.start_time}
          onChange={handleChange}
          required
        />
        <Input
          type="datetime-local"
          name="end_time"
          placeholder="End Time"
          value={formData.end_time}
          onChange={handleChange}
          required
        />
        <TextArea
          name="note"
          placeholder="Note"
          value={formData.note}
          onChange={handleChange}
          rows={3}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <StyledButton type="submit">Create Trip</StyledButton>
      </StyledForm>
    </MainContainer>
  );
}

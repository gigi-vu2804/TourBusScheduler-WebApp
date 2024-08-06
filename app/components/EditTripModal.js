// components/EditTripModal.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { updateTrip } from "../_services/trip-services";
import { getDrivers } from "../_services/driver-services";
import { getBuses } from "../_services/bus-services";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px 30px;
  border-radius: 8px;
  width: 600px;
  max-width: 95%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #888;
`;

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
`;

const SaveButton = styled.button`
  grid-column: span 2;
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 12px;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  margin-top: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

const ErrorMessage = styled.p`
  grid-column: span 2;
  color: red;
  font-size: 16px;
  margin-top: 0;
`;

export default function EditTripModal({ trip, onClose, onSave }) {
  const [formData, setFormData] = useState(trip);
  const [error, setError] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    setFormData(trip);
  }, [trip]);

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

    fetchBuses();
    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await updateTrip(trip.id, formData);
      onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Edit Trip</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <StyledForm onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="trip_name">Trip Name</Label>
            <Input
              type="text"
              id="trip_name"
              name="trip_name"
              value={formData.trip_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="pickup">Pickup Location</Label>
            <Input
              type="text"
              id="pickup"
              name="pickup"
              value={formData.pickup}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="client_name">Client Name</Label>
            <Input
              type="text"
              id="client_name"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="vehicle_id">Vehicle</Label>
            <Select
              id="vehicle_id"
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
          </div>
          <div>
            <Label htmlFor="driver_id">Driver</Label>
            <Select
              id="driver_id"
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
          </div>
          <div>
            <Label htmlFor="start_time">Start Time</Label>
            <Input
              type="datetime-local"
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="end_time">End Time</Label>
            <Input
              type="datetime-local"
              id="end_time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="note">Note</Label>
            <TextArea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
            />
          </div>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SaveButton type="submit">Save Changes</SaveButton>
        </StyledForm>
      </ModalContent>
    </ModalOverlay>
  );
}

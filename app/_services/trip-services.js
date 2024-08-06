// app/_services/trip-services.js

import { db } from "../_utils/firebase";
import {
  collection,
  query,
  addDoc,
  orderBy,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import * as XLSX from "xlsx";

// Collection reference
const tripsCollection = collection(db, "trips");

/**
 * Function to add a new trip to the Firestore
 * @param {Object} tripData - The data of the trip to be added
 */
export const addTrip = async (tripData) => {
  try {
    await addDoc(tripsCollection, tripData);
  } catch (error) {
    console.error("Error adding trip: ", error);
    throw error;
  }
};

/**
 * Function to get all trips from Firestore
 * @returns {Array} - Array of trip documents
 */
export const getTrips = async () => {
  try {
    const tripsQuery = query(tripsCollection, orderBy("start_time"));
    const tripsSnapshot = await getDocs(tripsQuery);
    const tripsList = tripsSnapshot.docs.map((doc) => {
      const data = doc.data();
      const startTime = new Date(data.start_time); // Convert string to Date
      const endTime = new Date(data.end_time); // Convert string to Date

      return {
        id: doc.id,
        ...data,
        start: startTime,
        end: endTime,
      };
    });
    console.log("Fetched trips:", tripsList); // Debugging
    return tripsList;
  } catch (error) {
    console.error("Error fetching trips: ", error);
    throw error;
  }
};

/**
 * Function to update a trip in Firestore
 * @param {string} tripId - The ID of the trip to update
 * @param {Object} updatedData - The new data for the trip
 */
export const updateTrip = async (tripId, updatedData) => {
  try {
    const tripDocRef = doc(tripsCollection, tripId);
    await updateDoc(tripDocRef, updatedData);
    console.log("Trip updated successfully");
  } catch (error) {
    console.error("Error updating trip: ", error);
    throw error;
  }
};

/**
 * Function to delete a trip from Firestore
 * @param {string} tripId - The ID of the trip to delete
 */
export const deleteTrip = async (tripId) => {
  try {
    const tripDocRef = doc(tripsCollection, tripId);
    await deleteDoc(tripDocRef);
    console.log("Trip deleted successfully");
  } catch (error) {
    console.error("Error deleting trip: ", error);
    throw error;
  }
};

/**
 * Function to export trips to a CSV file
 * @param {Array} trips - Array of trip documents
 */
export const exportTripsToCSV = (trips) => {
  const csvContent = [
    [
      "Trip Name",
      "Pickup",
      "Destination",
      "Vehicle Plate",
      "Driver Name",
      "Client",
      "Start Time",
      "End Time",
      "Note",
    ],
    ...trips.map((trip) => [
      trip.trip_name,
      trip.pickup,
      trip.destination,
      trip.vehicle_plate,
      trip.driver_name,
      trip.client_name,
      new Date(trip.start_time).toLocaleString(),
      new Date(trip.end_time).toLocaleString(),
      trip.note,
    ]),
  ]
    .map((e) => e.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "trips.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Function to export trips to an Excel file
 * @param {Array} trips - Array of trip documents
 */
export const exportTripsToExcel = (trips) => {
  const worksheet = XLSX.utils.json_to_sheet(
    trips.map((trip) => ({
      "Trip Name": trip.trip_name,
      Pickup: trip.pickup,
      Destination: trip.destination,
      "Vehicle Plate": trip.vehicle_plate,
      "Driver Name": trip.driver_name,
      Client: trip.client_name,
      "Start Time": new Date(trip.start_time).toLocaleString(),
      "End Time": new Date(trip.end_time).toLocaleString(),
      Note: trip.note,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Trips");

  XLSX.writeFile(workbook, "trips.xlsx");
};

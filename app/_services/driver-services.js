// app/_services/driver-services.js

import { db } from "../_utils/firebase"; // Ensure the path is correct
import { collection, query, getDocs, orderBy } from "firebase/firestore";

// Collection reference
const driversCollection = collection(db, "drivers");

/**
 * Function to fetch all drivers from Firestore
 * @returns {Promise<Array>} - Promise resolving to an array of driver documents
 */
export const getDrivers = async () => {
  try {
    const driversQuery = query(driversCollection, orderBy("first_name"));
    const driversSnapshot = await getDocs(driversQuery);
    const driversList = driversSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched drivers:", driversList); // Debugging
    return driversList;
  } catch (error) {
    console.error("Error fetching drivers: ", error);
    throw error;
  }
};

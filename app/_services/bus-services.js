// app/_services/bus-services.js

import { db } from "../_utils/firebase"; // Ensure the path is correct
import { collection, getDocs, query, orderBy } from "firebase/firestore";

// Collection reference
const busesCollection = collection(db, "buses");

/**
 * Function to fetch all buses from Firestore
 * @returns {Promise<Array>} - Promise resolving to an array of bus documents
 */
export const getBuses = async () => {
  try {
    const busesQuery = query(busesCollection, orderBy("license_plate"));
    const busesSnapshot = await getDocs(busesQuery);
    const busesList = busesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched buses:", busesList); // Debugging
    return busesList;
  } catch (error) {
    console.error("Error fetching buses: ", error);
    throw error;
  }
};

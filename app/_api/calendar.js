// pages/api/schedules.js
export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      // Fetch schedules
      res.status(200).json({ schedules: [] });
      break;
    case "POST":
      // Add a new schedule
      res.status(201).send();
      break;
    case "PUT":
      // Update a schedule
      res.status(200).send();
      break;
    case "DELETE":
      // Delete a schedule
      res.status(204).send();
      break;
    default:
      res.status(405).end(); // Method Not Allowed
      break;
  }
}

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Sample endpoint to receive print jobs
app.post('/print', (req, res) => {
  const { printer, job } = req.body;

  console.log(`Print job received:`);
  console.log(`Printer: ${printer}`);
  console.log(`Job: ${job}`);

  // Here you would add logic to send the print job to the printer.
  // This is just a simulation.

  res.send(`Print job sent to printer: ${printer}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const escpos = require('escpos');
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Sample endpoint to receive print jobs
app.post('/print', async (req, res) => {
  const { printer, job } = req.body;

  console.log(`Print job received:`);
  console.log(`Printer: ${printer}`);
  console.log(`Job: ${job}`);

  // Example code to print using escpos
  try {
    const device = new escpos.Bluetooth(printer); // Replace with your printer connection
    const printerInstance = new escpos.Printer(device);

    device.open((error) => {
      if (error) {
        console.error('Error opening printer:', error);
        return res.status(500).send('Error opening printer');
      }

      printerInstance
        .text(job)
        .cut()
        .close(() => {
          console.log(`Print job sent to printer: ${printer}`);
          res.send(`Print job sent to printer: ${printer}`);
        });
    });
  } catch (error) {
    console.error('Error sending print job:', error);
    res.status(500).send('Error sending print job');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const escpos = require('escpos');
const { exec } = require('child_process');
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Sample endpoint to receive print jobs
app.post('/print', (req, res) => {
  const { printer, job, printerType } = req.body;

  console.log(`Print job received:`);
  console.log(`Printer: ${printer}`);
  console.log(`Job: ${job}`);
  console.log(`Printer Type: ${printerType}`);

  try {
    if (printerType === 'escpos') {
      // For ESC/POS printers
      const device = new escpos.Bluetooth(printer); // Adjust for your connection type
      const printerInstance = new escpos.Printer(device);

      device.open((error) => {
        if (error) throw error;
        printerInstance
          .text(job)
          .cut()
          .close(() => res.send(`Print job sent to ESC/POS printer: ${printer}`));
      });
    } else if (printerType === 'laser') {
      // For Laser printers
      const printCommand = `lp -d ${printer} -`; // Replace with appropriate command or library
      exec(printCommand, { input: job }, (error, stdout, stderr) => {
        if (error) {
          console.error('Error sending print job:', error);
          res.status(500).send('Error sending print job');
        } else {
          res.send(`Print job sent to Laser printer: ${printer}`);
        }
      });
    } else if (printerType === 'inkjet') {
      // For Inkjet printers
      const printCommand = `lp -d ${printer} -`; // Replace with appropriate command or library
      exec(printCommand, { input: job }, (error, stdout, stderr) => {
        if (error) {
          console.error('Error sending print job:', error);
          res.status(500).send('Error sending print job');
        } else {
          res.send(`Print job sent to Inkjet printer: ${printer}`);
        }
      });
    } else {
      res.status(400).send('Unsupported printer type');
    }
  } catch (error) {
    console.error('Error sending print job:', error);
    res.status(500).send('Error sending print job');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

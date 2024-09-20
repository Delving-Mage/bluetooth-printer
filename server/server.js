const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Helper function to execute shell commands asynchronously
const { exec } = require('child_process');

const execCommand = (command, input) => {
  return new Promise((resolve, reject) => {
    exec(command, { input }, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
      }
      if (stderr) {
        reject(`Stderr: ${stderr}`);
      }
      resolve(stdout);
    });
  });
};


// Sample endpoint to receive print jobs
app.post('/print', async (req, res) => {
  const { printer, job, printerType } = req.body;

  console.log(`Print job received:`);
  console.log(`Printer: ${printer}`);
  console.log(`Job: ${job}`);
  console.log(`Printer Type: ${printerType}`);

  try {
    let printCommand = `lp -d ${printer} -`; // Replace with appropriate command

    if (printerType) {
      const result = await execCommand(printCommand, job);
      console.log('Print Command Result:', result);
      res.send(`Print job sent to ${printerType} printer: ${printer}`);
    } else {
      // Handle other printer types
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

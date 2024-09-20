const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const os = require('os');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Endpoint to get the list of paired Bluetooth printers
app.get('/printers', (req, res) => {
  const currentOS = os.platform();
  let command;

  
  // Identify the OS and prepare the appropriate command
  if (currentOS === 'darwin') {
    // macOS
    command = 'system_profiler SPBluetoothDataType';
  } else if (currentOS === 'win32' || currentOS === 'win64' || currentOS === 'windows') {
    // Windows
    command = 'powershell "Get-PnpDevice -Class Printer | Select-Object -Property FriendlyName, InstanceId"';
  } else if (currentOS === 'linux') {
    // Linux
    command = 'lpstat -p -d'; // Command to list printers in Linux
  } else {
    return res.status(400).send('Unsupported OS');
  }
  

  exec(command, (error, stdout) => {
    if (error) {
      console.error('Error finding printers:', error);
      return res.status(500).send('Could not retrieve printers');
    }

    const printers = stdout.split('\n').filter(line => line.trim() !== '');
    res.json(printers);
  });
});

app.post('/print', (req, res) => {
  const { printerName, job } = req.body;
  const currentOS = os.platform();

  // Check if printerName and job are provided
  if (!printerName || !job) {
    return res.status(400).send('Printer name and job must be provided.');
  }

  let command;

  // Identify the OS and prepare the appropriate command
  if (currentOS === 'darwin') {
    command = `system_profiler SPBluetoothDataType | grep -A 1 "${printerName}"`;
  } else if (currentOS === 'win32') {
    command = `powershell "Get-PnpDevice -Class Printer | Where-Object {$_.FriendlyName -eq '${printerName}'}"`;
  } else {
    return res.status(400).send('Unsupported OS');
  }

  // Find the printer's MAC address or identifier
  exec(command, (error, stdout) => {
    if (error) {
      console.error('Error finding printer:', error);
      return res.status(500).send('Printer not found');
    }

    const lines = stdout.split('\n');
    const printerInfo = lines.find(line => line.includes(printerName));

    if (!printerInfo) {
      return res.status(404).send('Printer not found');
    }

    let printCommand;
    if (currentOS === 'darwin') {
      const macAddress = printerInfo.split(' ')[1]; // Adjust parsing as needed
      printCommand = `echo "${job}" | lp -d "${macAddress}"`;
    } else if (currentOS === 'win32') {
      printCommand = `powershell "Add-Type -AssemblyName System.Drawing; $p = New-Object System.Drawing.Printing.PrintDocument; $p.PrinterSettings.PrinterName = '${printerName}'; $p.PrintPage += { $text = '${job}'; $e.Graphics.DrawString($text, [System.Drawing.SystemFonts]::DefaultFont, [System.Drawing.Brushes]::Black, 10, 10) }; $p.Print()"`;
    }

    // Execute the print command
    exec(printCommand, (error) => {
      if (error) {
        console.error('Error sending print job:', error);
        return res.status(500).send('Failed to send print job');
      }

      res.send(`Print job sent to ${printerName}`);
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

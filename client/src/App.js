import axios from 'axios';
import React, { useState } from 'react';

function App() {
  const [printer, setPrinter] = useState(null);
  const [printers, setPrinters] = useState([]);
  const [printerType, setPrinterType] = useState('escpos'); // Default printer type

  // Function to connect to a Bluetooth printer
  const connectPrinter = async () => {
    try {
      // Request any Bluetooth device (you may need to filter for printers later)
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true
      });

      const server = await device.gatt.connect();
      alert('Connected to printer:', device.name);
      setPrinter(device.name);
      setPrinters([...printers, device.name]); // Save connected printer
    } catch (error) {
      alert('Error connecting to Bluetooth printer:', error);
    }
  };

  // Unified sendPrintJob function
  const sendPrintJob = async (buttonType) => {
    let selectedPrinter;

    // Determine printer based on button type
    if (printers.length > 1) {
      if (buttonType === 'KOT') {
        selectedPrinter = printers[0]; // First printer for KOT Print
      } else if (buttonType === 'SAVE') {
        selectedPrinter = printers[1]; // Second printer for Save & Print
      }
    } else if (printers.length === 1) {
      selectedPrinter = printers[0]; // Use the only connected printer
    }

    if (selectedPrinter) {
      // Job data based on button type
      const jobData = buttonType === 'KOT' ? 'KOT Print Data' : 'Save & Print Data';

      try {
        // Use axios to send the print job
        const response = await axios.post('https://bluetooth-printer.onrender.com/print', {
          printer: selectedPrinter,
          job: jobData,
          printerType: printerType // Pass the selected printer type
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        alert(response.data);
      } catch (error) {
        console.error('Error sending print job:', error);
      }
    } else {
      alert('No printers connected');
    }
  };

  return (
    <div className="App">
      <h1>Bluetooth Printer Connection</h1>
      <button onClick={connectPrinter}>Connect Bluetooth Printer</button>
      <div>
        {printers.length > 0 && (
          <div>
            <h2>Connected Printers:</h2>
            <ul>
              {printers.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Dropdown for selecting printer type */}
      <div>
        <label htmlFor="printerType">Select Printer Type: </label>
        <select
          id="printerType"
          value={printerType}
          onChange={(e) => setPrinterType(e.target.value)}
        >
          <option value="escpos">ESC/POS</option>
          <option value="laser">Laser</option>
          <option value="inkjet">Inkjet</option>
          <option value="thermal">Thermal</option>
          {/* Add more printer types as needed */}
        </select>
      </div>

      {/* Updated button click handlers to pass the correct button type */}
      <button onClick={() => sendPrintJob('KOT')}>KOT Print</button>
      <button onClick={() => sendPrintJob('SAVE')}>Save & Print</button>
    </div>
  );
}

export default App;

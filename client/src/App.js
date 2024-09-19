import axios from 'axios';
import React, { useState } from 'react';

function App() {
  const [printer, setPrinter] = useState(null);
  const [printers, setPrinters] = useState([]);

  // Function to connect to a Bluetooth printer
  const connectPrinter = async () => {
    try {
      // Request any Bluetooth device (you may need to filter for printers later)
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true
      });

      const server = await device.gatt.connect();
      console.log('Connected to printer:', device.name);
      setPrinter(device.name);
      setPrinters([...printers, device.name]); // Save connected printer
    } catch (error) {
      console.log('Error connecting to Bluetooth printer:', error);
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
        const response = await axios.post('https://delve-bluetoothprinter.onrender.com/print', {
          printer: selectedPrinter,
          job: jobData
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        console.log(response.data);
      } catch (error) {
        console.error('Error sending print job:', error);
      }
    } else {
      console.log('No printers connected');
    }
  };
  // const sendPrintJob = async (buttonType) => {
  //   let selectedPrinter;

  //   // Determine printer based on button type
  //   if (printers.length > 1) {
  //     if (buttonType === 'KOT') {
  //       selectedPrinter = printers[0]; // First printer for KOT Print
  //     } else if (buttonType === 'SAVE') {
  //       selectedPrinter = printers[1]; // Second printer for Save & Print
  //     }
  //   } else if (printers.length === 1) {
  //     selectedPrinter = printers[0]; // Use the only connected printer
  //   }

  //   if (selectedPrinter) {
  //     // Job data based on button type
  //     const jobData = buttonType === 'KOT' ? 'KOT Print Data' : 'Save & Print Data';

  //     // Logic to send print data to the connected printer
  //     const response = await fetch('/print', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ printer: selectedPrinter, job: jobData }),
  //     });

  //     const result = await response.text();
  //     console.log(result);
  //   } else {
  //     console.log('No printers connected');
  //   }
  // };

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

      {/* Updated button click handlers to pass the correct button type */}
      <button onClick={() => sendPrintJob('KOT')}>KOT Print</button>
      <button onClick={() => sendPrintJob('SAVE')}>Save & Print</button>
    </div>
  );
}

export default App;

import axios from 'axios';
import React, { useState } from 'react';
import './App.css';

function App() {
  const [printer, setPrinter] = useState(null);
  const [printers, setPrinters] = useState([]);
  const [printerType, setPrinterType] = useState('escpos'); // Default printer type
  const [loading, setLoading] = useState(false); // Loader state

  const connectPrinter = async () => {
    setLoading(true); // Show loader
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });

      await device.gatt.connect();
      alert('Connected to printer: ' + device.name);
      setPrinter(device.name);
      setPrinters([...printers, device.name]); // Save connected printer
    } catch (error) {
      alert('Error connecting to Bluetooth printer: ' + error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const sendPrintJob = async (buttonType) => {
    let selectedPrinter;

    if (printers.length > 1) {
      selectedPrinter = buttonType === 'KOT' ? printers[0] : printers[1]; // KOT or Save & Print
    } else if (printers.length === 1) {
      selectedPrinter = printers[0]; // Use the only connected printer
    }

    if (selectedPrinter) {
      const jobData = buttonType === 'KOT' ? 'KOT Print Data' : 'Save & Print Data';
      setLoading(true); // Show loader
      try {
        const response = await axios.post(
          'https://bluetooth-printer.onrender.com/print',
          {
            printer: selectedPrinter,
            job: jobData,
            printerType: printerType,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        alert(response.data);
      } catch (error) {
        alert('Error sending print job: ' + error);
      } finally {
        setLoading(false); // Hide loader
      }
    } else {
      alert('No printers connected');
    }
  };

  return (
    <div className="App">
      <h1>Bluetooth Printer Connection</h1>

      {/* Loader */}
      {loading && <div className="loader"></div>}

      <button onClick={connectPrinter} disabled={loading}>Connect Bluetooth Printer</button>
      
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

      <div>
        <label htmlFor="printerType">Select Printer Type: </label>
        <select
          id="printerType"
          value={printerType}
          onChange={(e) => setPrinterType(e.target.value)}
          disabled={loading}
        >
          <option value="escpos">ESC/POS</option>
          <option value="laser">Laser</option>
          <option value="inkjet">Inkjet</option>
          <option value="thermal">Thermal</option>
        </select>
      </div>

      <button onClick={() => sendPrintJob('KOT')} disabled={loading}>KOT Print</button>
      <span> </span>
      <button onClick={() => sendPrintJob('SAVE')} disabled={loading}>Save & Print</button>
    </div>
  );
}

export default App;

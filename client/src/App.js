import axios from 'axios';
import React, { useState } from 'react';
import './App.css';

function App() {
  const [printerIdentifier, setPrinterIdentifier] = useState(''); // Can be name or MAC address
  const [loading, setLoading] = useState(false);
  const [printJob, setPrintJob] = useState('Hello, this is a test print!');

  const connectPrinter = async () => {
    setLoading(true);
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });

      setPrinterIdentifier(device.name); // Set the printer name or MAC
      alert('Connected to printer: ' + device.name);
    } catch (error) {
      alert('Error connecting to Bluetooth printer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendPrintJob = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://bluetooth-printer.onrender.com/print', {
        printerName: printerIdentifier, // Send printer identifier
        job: printJob,
      });

      alert(response.data);
    } catch (error) {
      alert('Error sending print job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Bluetooth Printer Connection</h1>
      {loading && <div className="loader"></div>}

      <button onClick={connectPrinter} disabled={loading}>
        Connect Bluetooth Printer
      </button>

      <div>
        <h2>Printer Identifier:</h2>
        <div
        >{printerIdentifier}</div>
      </div>

      <textarea 
        value={printJob} 
        onChange={(e) => setPrintJob(e.target.value)} 
        placeholder="Enter your print job text here"
      />

      <button onClick={sendPrintJob} disabled={loading || !printerIdentifier}>
        Send Print Job
      </button>
    </div>
  );
}

export default App;

// RunWindow.js

import React, { useState } from 'react';

function RunWindow({ onClose }) {
  const [responseMessage, setResponseMessage] = useState('');

  const handleRun = async () => {
    try {
      console.log("Attempting to send request to Flask server...");
      const response = await fetch('http://127.0.0.1:5000/run', {
        method: 'POST',
      });

      if (!response.body) {
        throw new Error('ReadableStream not yet supported in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          console.log("Received chunk:", chunk);
          setResponseMessage(prev => prev + chunk);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('Error: ' + error.message);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.window}>
        <h2>Run Script</h2>
        <button onClick={handleRun}>Run</button>
        <button onClick={onClose}>Cancel</button>
        <div style={styles.response}>
          <pre>{responseMessage}</pre>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  window: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    width: '80%',
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
  },
  response: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '5px',
    marginTop: '10px',
  },
};

export default RunWindow;

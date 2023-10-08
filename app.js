const express = require('express');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

const SESSION_FILE_PATH = path.join(__dirname, 'session.json');
let sessionData;

// Load session data if it exists
const loadSessionData = function () {
  if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
  }
};

// Create a new WhatsApp client
const createClient = function () {
  return new Client({ session: sessionData });
};

// Event when QR code is generated
const onQRGenerated = function (client) {
  client.on('qr', (qrCode) => {
    qrcode.toString(qrCode, (err, url) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return;
      }
      console.log('Scan the QR code to log in:', url);
    });
  });
};

// Event when the client is ready
const onClientReady = function (client) {
  client.on('ready', () => {
    console.log('WhatsApp client is ready');
    sendWhatsAppMessage(client);
  });
};

// Function to send a WhatsApp message
const sendWhatsAppMessage = function (client) {
  const targetNumber = 'XXXXXXXXXXXX'; // Replace with the recipient's phone number
  const message = 'Hello, there!';

  client.sendMessage(targetNumber, message).then((message) => {
    console.log('Message sent:', message.id._serialized);
  });
};

// Start the WhatsApp client
const startClient = function (client) {
  client.initialize();
};

// Start the express app
const startApp = function () {
  const app = express();
  app.listen(5000, () => {
    console.log('Listening on port 5000');
  });
};

// Main function to run the application
const main = function () {
  loadSessionData();

  const client = createClient();

  onQRGenerated(client);

  onClientReady(client);

  startClient(client);

  startApp();
};

main();

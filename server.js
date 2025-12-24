const express = require('express');
const { ExpressPeerServer } = require('peer');
const path = require('path');

const app = express();
const server = require('http').Server(app);
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/peerjs'
});

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// PeerJS server
app.use('/peerjs', peerServer);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/view', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

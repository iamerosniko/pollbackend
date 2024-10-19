const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
  }
});

// Sample data for individuals
let individuals = [
];

// Socket.io logic
io.on('connection', (socket) => {
  console.log('New client connected');

  // Send initial list of individuals
  socket.emit('individuals', individuals);

  // Admin adds a new individual
  socket.on('addIndividual', (data) => {
    individuals.push({ name: data.name, gender: data.gender, votes: 0 });
    io.emit('individuals', individuals); // Broadcast updated list to all clients
  });

  // User votes for an individual
  socket.on('vote', (name) => {
    const person = individuals.find(ind => ind.name === name);
    if (person) {
      person.votes += 1;
      io.emit('individuals', individuals); // Broadcast updated list to all clients
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

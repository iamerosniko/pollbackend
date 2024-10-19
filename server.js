const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Serve Angular static files
app.use(express.static(path.join(__dirname, 'dist/va')));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for Socket.io
    methods: ["GET", "POST"],
  }
});

// Socket.io logic here
let individuals = [
];

io.on('connection', (socket) => {
  console.log('New client connected');

  // Send initial list of individuals
  socket.emit('individuals', individuals);

  socket.on('addIndividual', (data) => {
    individuals.push({ name: data.name, gender: data.gender, votes: 0 });
    io.emit('individuals', individuals);
  });

  socket.on('vote', (name) => {
    const person = individuals.find(ind => ind.name === name);
    if (person) {
      person.votes += 1;
      io.emit('individuals', individuals);
    }
  });

  socket.on('reset', (val) => {
    console.log('reset');
    individuals=[];
    io.emit('individuals',individuals);
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});



// Redirect all other routes to Angular app (for routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/va/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//webframework for npdejs to create a server
import express from 'express';
//built-in module to create a http server bcoz soket.io needs a http server to work
import http from 'http';
//socket.io for real-time communication between client and server
import { Server } from 'socket.io';
//cors to allow cross-origin requests from the client to the server
import cors from 'cors';

import path from 'path';
const __dirname = path.resolve(); // Get the current directory name

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

//importing the socket event handlers from another file
import { handleSocketEvents } from './socketHandlers.js';

// Initialize Express app and server
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST'],
    }
});


// Store active rooms and their user
const activeRooms = new Map(); 

// Handle socket connection
handleSocketEvents(io, activeRooms);

if (process.env.NODE_ENV === "production") {
    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
    });

} 

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
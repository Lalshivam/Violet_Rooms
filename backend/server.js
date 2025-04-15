//webframework for npdejs to create a server
import express from 'express';
//built-in module to create a http server bcoz soket.io needs a http server to work
import http from 'http';
//socket.io for real-time communication between client and server
import { Server } from 'socket.io';
//cors to allow cross-origin requests from the client to the server
import cors from 'cors';

// Initialize Express app and server
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
});

// Store active rooms and their user
const activeRooms = new Map(); 

// Handle socket connection
io.on("connection", (socket) => {
    console.log('A user connected:', socket.id);

    // Join a room based on codeword
    socket.on('join_room', (roomHash) => {
        socket.join(roomHash);

        //update room user cnt
        if(!activeRooms.has(roomHash)){
            activeRooms.set(roomHash,new Set());
        }
        activeRooms.get(roomHash).add(socket.id);

        //Broadcast updated user cnt to everyone in the room 
        const usercnt = activeRooms.get(roomHash).size;
        io.to(roomHash).emit('user_cnt_update',usercnt);

        console.log(`User ${socket.id} joined ${roomHash}. Users in room : ${usercnt}`);
    });

    // Handle sending message
    socket.on("send_message", (data) => {
        console.log('Message:', data);
        io.to(data.room).emit('receive_message', data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        activeRooms.forEach((users,roomHash) =>{
            if(users.has(socket.id)){
                users.delete(socket.id);
                const usercnt = users.size;
                io.to(roomHash).emit('user_cnt_update',usercnt);

                //clean up empty rooms
                if(users.size === 0){
                    activeRooms.delete(roomHash);
                }
            }
        });
        console.log('User Disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export const handleSocketEvents = (io, activeRooms) => {
    // Handle socket connection
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Join a room based on codeword
        socket.on("join_room", (roomHash) => {
            socket.join(roomHash);

            // Update room user count
            if (!activeRooms.has(roomHash)) {
                activeRooms.set(roomHash, new Set());
            }
            activeRooms.get(roomHash).add(socket.id);

            // Broadcast updated user count to everyone in the room
            const userCount = activeRooms.get(roomHash).size;
            io.to(roomHash).emit("user_cnt_update", userCount);

            console.log(`User ${socket.id} joined ${roomHash}. Users in room: ${userCount}`);
        });

        // Handle sending message
        socket.on("send_message", (data) => {
            console.log("Message:", data);
            io.to(data.room).emit("receive_message", data);
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            activeRooms.forEach((users, roomHash) => {
                if (users.has(socket.id)) {
                    users.delete(socket.id);
                    const userCount = users.size;
                    io.to(roomHash).emit("user_cnt_update", userCount);

                    // Clean up empty rooms
                    if (users.size === 0) {
                        activeRooms.delete(roomHash);
                    }
                }
            });
            console.log("User Disconnected:", socket.id);
        });
    });
};

import "../init.jsx";
import React, { useRef ,useState, useEffect } from "react";
import { io } from "socket.io-client";

// Initialize socket connection
const socket = io.connect("http://localhost:5000");

function ChatRoom({ room }) {
    // State for chat messages, input message, and user count
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [userCount, setUserCount] = useState(1);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        console.log(`Joining room with codeword: ${room}`);
        // Emit joined event with codeword
        socket.emit("join_room", room);

        socket.on('receive_message', (data) => {
            setMessages((prev) => [...prev, data]);
          });
      

        socket.on('user_cnt_update', (count) => {
            setUserCount(count);
          });

        // Cleanup on unmount
        return () => {
            socket.off('receive_message');
            socket.off('user_cnt_update');
        };
    }, [room]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    useEffect(()=>{
        scrollToBottom();
    },[messages]);

    // Function to send message
    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const messageData = {
                room : room,
                sender : socket.id,
                message : message,
                time : new Date().toLocaleTimeString(),
            };
            socket.emit("send_message", messageData);
            // setMessages((prev) => [...prev,messageData]);
            setMessage("");
        }
    };

    return (
        <div className="chat-room">
            <div className="chat-header">
                <h2>Room:{room}</h2>
                <div className="user-cnt">
                    {userCount}{userCount === 1 ? ' user': ' users'} online
                </div>
            </div>
            <div className="messages">
                {messages.map((msg,idx) =>(
                    <div
                       key={idx}
                       className={`message ${msg.sender === socket.id ? 'sent' : 'received'}`}
                       >
                        <p>{socket.id} : {msg.message}</p>
                        <span>{msg.time}</span>
                       </div>
                ))}
                <div ref={messagesEndRef}/>
            </div>
            <form onSubmit={sendMessage}>
                <input 
                type="text"
                value={message}
                onChange={(e)=> setMessage(e.target.value)}
                placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default ChatRoom;
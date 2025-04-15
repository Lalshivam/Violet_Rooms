import { useState } from 'react';
import JoinRoom from "./components/JoinRoom.jsx";
import ChatRoom from "./components/ChatRoom.jsx";
import './App.css'

function App() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  // Handle joining the chat room
  const handleJoin = (roomHash) => {
      setRoom(roomHash)
      setJoined(true);
  };
  
  return (
    <div className="App">
      {!joined ? (
        <JoinRoom onJoin={handleJoin}/>
      ) : (
        <ChatRoom room={room}/>
      )}
    </div>
  );
}

export default App;

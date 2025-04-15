import React, {useState} from 'react';

function JoinRoom({ onJoin }) {
    const [roomHash,setRoomHash] = useState('');

    const handleSubmit = (e) =>{
        e.preventDefault();
        if(roomHash.trim()){
            onJoin(roomHash);
        }
    };

    return(
        <div className='join-room'>
            <h1>Join room</h1>
            <form onSubmit={handleSubmit}>
                <input type="text"
                placeholder='Enter hash or code' 
                value={roomHash}
                onChange={(e)=>setRoomHash(e.target.value)}
                />
                <button type='submit'>Join Room</button>
            </form>
        </div>
    );
}

export default JoinRoom;
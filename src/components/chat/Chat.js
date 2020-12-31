import React from 'react';
import './chat.css';

import Bar from '../infobar/Bar.js';
import Messages from '../messages/Message-room.js';
import Input from '../input/Input.js';

function  Chat({user, setUser, rooms, users, roomMessages, setRoomMessages, totalUsesrRooms, setModal, newPrivMessage, setNewPrivMessage, setPrivateModal}) {
    
    return (
        <div className='Chat'>
            <Bar user={user} setUser={setUser} rooms={rooms} users={users} totalUsesrRooms={totalUsesrRooms} setRoomMessages={setRoomMessages} setModal={setModal} newPrivMessage={newPrivMessage} setNewPrivMessage={setNewPrivMessage} setPrivateModal={setPrivateModal}/>
            <div className='mes__input__wrapper'>
                <Messages roomMessages={roomMessages}/>
                <Input user={user}/>
            </div>
        </div>
    )
}

export default Chat;
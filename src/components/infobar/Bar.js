import React from 'react';
import './bar.css';

function Bar({user, setUser, rooms, users, totalUsesrRooms, setRoomMessages, setModal, newPrivMessage, setNewPrivMessage, setPrivateModal}) {

    const changeRoom = (destRoom) => {
        if (destRoom === user.room) return;
        setUser((state) => ({...state, room: destRoom}));
        fetch('http://localhost:4000/changeroom', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
          'Content-type': 'application/json'
            },
            body: JSON.stringify({username: user.name, socketId: user.socketId, room: destRoom})
        }).then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('"CHANGE ROOM" error. Hapenned error during query confirm of data when change room!')
            }
          }).then((res) => {
            setRoomMessages(res.storeMessage);
          }).catch((err) => { console.error(err) });  // in case of output error;
    }

    const privMes = (item) => {
        if (item === user.name) {
             return;
        } else {
            setModal(item)
        }
    }
    
    return (
        <div className='Bar'>
            <div className='total__stats'>
                <div className='bar__title'>Statistics</div>
                <div className='inner__total__users'>users online: {totalUsesrRooms.users}</div>
                <div className='inner__total__rooms'>rooms open: {totalUsesrRooms.rooms}</div>
            </div>
            <div className={newPrivMessage ? 'private__block active' : 'private__block'} onClick={() => {setPrivateModal(true); setNewPrivMessage(false)}}>
                <span className='private__title'>Mail&emsp;</span>
                <span className={newPrivMessage ? 'letter flash' : 'letter'}>&#9993;</span>
                <span className='mes'>{user.privMes.length}</span>
            </div>
            <div className='bar__users'>
                <div className='bar__title'>Users</div>
                <div className='bar__item__wrapper'>
                    {users.length === 0 ? '' :
                        users.map((item, i) => 
                        <div key={i} onClick={() => privMes(item)} className={user.name === item ? 'bar__item current' : 'bar__item'}>
                            {item}
                        </div>)
                    }
                </div>     
            </div>
            <div className='bar__rooms'>
                <div className='bar__title'>Rooms<div onClick={() => setModal(1)} className='create__room'></div></div>
                <div className='bar__item__wrapper'>
                    {rooms.length === 0 ? '' : 
                        rooms.map((item, i) => 
                        <div key={i} onClick={() => changeRoom(item)} className={user.room === item ? 'bar__item current' : 'bar__item'}>
                            {item}
                        </div>)
                    }
                </div>    
            </div>
        </div>
    )
}

export default Bar;
import React, { useCallback, useEffect, useState } from 'react';
import './App.css';

import Auth from './components/auth/Auth.js';
import Chat from './components/chat/Chat.js';
import Modal from './components/modal/Modal.js';
import PrivateModal from './components/modal/Privatemodal.js';

import { io } from 'socket.io-client';
const socket = io('http://localhost:4000', {
    autoConnect: false   
});


function App() {

  const [login, setLogin] = useState(false);  //  status of auth
  const [user, setUser] = useState({name: '', room: 'MainRoom', socketId: '', privMes: []});    //  {name: 'username', room: 'current Room', privMes: [{from: 'username', mesText: 'any text', date: date time}]}
  const [rooms, setRooms] = useState([]);   //  all rooms
  const [users, setusers] = useState([]);   //  all users
  const [totalUsesrRooms, setTotalUsersRooms] = useState({users: 0, rooms: 0})
  const [roomMessages, setRoomMessages] = useState([]);   //  {name: 'username', textMessage: 'any text', date: date message}
  const [modal, setModal] = useState(false);  // 1 - create room; 'username' - write private message; default false
  const [privateModal, setPrivateModal] = useState(false);    // if click on block where location private message, flag become 'true' and showed block 'Privatemodal' 
  const [newPrivMessage, setNewPrivMessage] = useState(false);  // when receive message then this flag become 'true';

  useEffect(() => {   // when loading or reload the page we do GET query to server that confirm user login with help of check key of session.
      fetch('http://localhost:4000/chat', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
      }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('You are not logged in')
      }
    }).then((res) => {
      setUser((state) => ({...state, name: res.name, room: res.room}));  // user get name
      setLogin(true);     // user get status is login
    }).catch((err) => { console.error(err) });  // in case of output error;
  }, []);
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////  ******  SOCKET.IO  ******  /////////////////////////////////////
  const getIdSocket = useCallback(() => {
      setUser((state) => ({...state, socketId: socket.id}));
      fetch('http://localhost:4000/confirm', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({username: user.name, socketId: socket.id, room: user.room})
      }).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Hapenned error during query CONFIRM of data!')
        }
      }).then((res) => {
        setRoomMessages(res.storeMessage)
      }).catch((err) => { console.error(err) });  // in case of output error;
  }, [user]);

  useEffect(() => {
    socket.on('connect', getIdSocket);
    return () => socket.off('connect', getIdSocket);
  },[getIdSocket])

  useEffect(() => {     
      if (login) {
        socket.open()
        return () => socket.close();
      }
  }, [login]);
  //-------------------------------------------//
  const privateMessage = useCallback((msg) => {
    if (!privateModal) {
      setNewPrivMessage(true);
    }
    const tmpMes = JSON.parse(msg)
    setUser((state) => ({...state, privMes: [...state.privMes, tmpMes]}));   // msg = {sender: 'username', text: 'any text', date: date time}
  }, [privateModal]);
  const messageRoomListener = (msg) => {
    setRoomMessages((state) => [...state, msg]);  //  {name: 'username', textMessage: 'any text', date: date message}
  }
  useEffect(() => {
    socket.on(user.name, privateMessage);   //  Listent private message by id user
    socket.on(user.room, messageRoomListener);  //  listent message current room (there is room user location)
    return () => {socket.off(user.name, privateMessage); socket.off(user.room, messageRoomListener)};
  }, [user, privateMessage]);
  //--------------------------------------------//
  const roomListener = (msg) => {
    setRooms(msg);  // string example: 'SuperRoom'
  }
  const usersListener = (msg) => {
    setusers(msg);  // string example: 'John Travolta'
  }
  const totalListener = (msg) => {
    const tmpData = JSON.parse(msg)
    setTotalUsersRooms({users: tmpData.users, rooms: tmpData.rooms})
  }
  useEffect(() => {
    socket.on('rooms info', roomListener);
    socket.on(`${user.room} users info`, usersListener);
    socket.on('total info', totalListener);
    return () => {socket.off('rooms info', roomListener); socket.off(`${user.room} users info`, usersListener); socket.off('total info', totalListener)};
  }, [login, user]);
  //////////////////////////////////  ******  /SOCKET.IO  ******  /////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  return (
    <div className="App">
      <Auth login={login} setLogin={setLogin} user={user} setUser={setUser} />
      {login && <Chat user={user} setUser={setUser} rooms={rooms} users={users} roomMessages={roomMessages} setRoomMessages={setRoomMessages} totalUsesrRooms={totalUsesrRooms} setModal={setModal} newPrivMessage={newPrivMessage} setNewPrivMessage={setNewPrivMessage} setPrivateModal={setPrivateModal}/>}
      {modal && <Modal user={user} modal={modal} setModal={setModal} />}
      {privateModal && <PrivateModal user={user} setPrivateModal={setPrivateModal} />}
    </div>
  );
}

export default App;

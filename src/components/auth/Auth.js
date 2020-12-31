import React, { useEffect, useState } from 'react';
import './auth.css';
import Authmodal from './auth-modals/Authmodal.js';

function Auth({login, setLogin, user, setUser}) {

    const [authModals, setAuthModals] = useState(false);  // 1 - login; 2 - reg; default - false;
    const [error, setError] = useState(false);            // string ('empty' or 'invalid' or 'used') || empty - it's mean that fiil field; invalid - no correct data; used - this username used yet;

    useEffect(() => {
        setError(false)
    }, [authModals])

    const showModal = (typeModal) => {
        if (typeModal === authModals) {
            setAuthModals(false) 
        } else {
            setAuthModals(typeModal)
        }
    }

    const exit = () => {
        fetch('http://localhost:4000/logout', {
            method: 'GET',
            credentials: 'include'
        });
        setUser({name: '', room: 'MainRoom', privMes: []});
        setLogin(false); 
    }

    const authQuery = (e, logVal, passVal) => {
        e.preventDefault(e);
        if (logVal.trim() === '' || passVal.trim() === '') {
            setError('Please fill in the fields!')
            return;
        }
        const URL = authModals === 1 ? 'http://localhost:4000/login' : 'http://localhost:4000/reg';
        fetch(URL, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({login: logVal, password: passVal})
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 400 || response.status === 401){
                const currentError = response.status === 400 ? 'Login or password is invalid!' : response.status === 401 ?  `Current "${logVal}" login used, again enter other USERNAME!` : false;
                if (currentError) {
                    setError(currentError);
                    throw new Error(currentError);
                }
            } else {
                throw new Error('Unexpected error!')
            }
        }).then((resp) => {
            if (resp.clarification === 'login') {  // check: login or reg
                setUser((state) => ({...state, name: resp.name, room: resp.room}));  // user get name
                setAuthModals(false);    // close modal
                setLogin(true);          // user is login
            } else if (resp.clarification === 'reg') {
                setAuthModals(1);  // open modal login
                alert(`${resp.name} registered successfully!`);
            }   
        }).catch(err => {
            setLogin(false);
            console.error(err);
        })
    }

    return (
        <>
            {authModals && <Authmodal authModals={authModals} setAuthModals={setAuthModals} authQuery={authQuery} error={error} setError={setError}/>}
            <div className='Auth'>
                <div className='logo'>(ˆ⌣ˆc) &copy;	&reg; &trade;</div>
                {login ? 
                    <button className='nav__button' onClick={() => exit()}>Log out</button> 
                :
                    <div className='nav__button__wrapper'>
                        <button className='nav__button' onClick={() => showModal(1)}>Log in</button>
                        <button className='nav__button' onClick={() => showModal(2)}>Register</button>
                    </div>
                }
            </div>
        </>
    )
}

export default Auth;
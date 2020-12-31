import React, { useState } from 'react';
import './input.css';

function Input({user}) {

    const [inputValue, setInputValue] = useState('');

    const changeInput = (e) => {
        setInputValue(e.target.value);
    }

    const sendMessage = (e) => {
        e.preventDefault();
        if (inputValue?.trim() === '') return;
        fetch('http://localhost:4000/message', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({name: user.name, room: user.room, text: inputValue})
        });
        setInputValue('');
    }

    return (
        <div className='Input'>
            <form className='input__form' onSubmit={(e) => sendMessage(e)}>
                <input type='text' className='input__mes' maxLength='1000' onChange={(e) => changeInput(e)} value={inputValue}/>
                <button className='input__sendler'>Send</button>
            </form>
        </div>
    )
}
export default Input;
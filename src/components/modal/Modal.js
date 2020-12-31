import React, { useState } from 'react';
import './modal.css';

function Modal({user, modal, setModal}) {

    const [valueM, setValueM] = useState('');

    const changeMI = (e) => {
        setValueM(e.target.value);
    }

    const modalAction = (e) => {
        e.preventDefault();
        if (valueM?.trim() === '') {setValueM(''); return}
        const tmpObj = modal === 1 ? ({data: valueM}) : ({text: valueM, recipient: modal, sender: user.name}); 
        const URL = modal === 1 ? 'http://localhost:4000/addroom' : 'http://localhost:4000/privmes';
        fetch(URL, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(tmpObj)
      }).then((response) => {
        if (!response.ok) {
            if (modal === 1) {
                throw new Error('Hapenned error during query "ADDROOM"!');
            } else {
                throw new Error('Hapenned error during query "PRIVMES"!');
            }
        }
      }).catch((err) => { console.error(err) });  // in case of output error;

        setValueM('');
        setModal(false)
    }

    return (
        <div className='Modal'>
            <div className='modal__cancel' onClick={() => setModal(false)}>X</div>
            <div className='chat__modal__title'>{modal === 1 ? 'Create new room' : 'Private message'}</div>
            <form className='chat__modal__form' onSubmit={(e) => modalAction(e)}>
                <input className='chat__modal__input' onChange={(e) => changeMI(e)} value={valueM} maxLength={modal === 1 ? '22' : '2000'} />
                <button className='chat__modal__button'>{modal === 1 ? 'create' : 'send'}</button>
            </form>
        </div>
    )
}

export default Modal;
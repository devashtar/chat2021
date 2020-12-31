import React from 'react';
import './modal.css';

function PrivateModal({user, setPrivateModal}) {
    
    return (
        <div className='Private__modal'>
            <div className='modal__closer' onClick={() => setPrivateModal(false)}>Close</div>
            <div className='private__modal__inner'>
                {user.privMes.length === 0 ? <div className='empty'>Empty</div> : 
                    user.privMes.map((item, i) => {
                        return (
                            <div key={i} className='private__message__wrapper'>
                                <div className='date__mes'>{item.date}</div>
                                <div className='content__mes'>
                                    <span className='sender__name'>{item.sender}&emsp;</span>
                                    <span className='text__mes'>{item.text}</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default PrivateModal;
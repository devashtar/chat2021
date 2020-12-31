import React, { useEffect, useRef } from 'react';
import './style.css';

function Messages({roomMessages}) {

    const refScroll = useRef(null);

    useEffect(() => {
        if (refScroll.current) {
            refScroll.current.scrollIntoView({ behavior: 'smooth' });
        }
    },[roomMessages])

    return (
        <div className='Messages'>
            {roomMessages.length === 0 ? '' :
                roomMessages.map((item, i) => {
                    return (
                        <div key={i} ref={refScroll} className='message__wrapper'>
                            <div className={i % 2 ? 'message__flex even' : 'message__flex'}>
                                <div className='message__date'>{item.date}</div>
                                <div className='message__item'>
                                    <span className='message__sender'>{item.name}:&emsp;</span>
                                    <span className='message__text'>{item.textMessage}</span>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Messages;
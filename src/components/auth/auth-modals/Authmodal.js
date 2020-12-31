import React, { useEffect, useState } from 'react';
import './style.css';

function Authmodal({authModals, setAuthModals, authQuery, error, setError}) {

    const [valueLogin, setValueLogin] = useState('');
    const [valuePass, setValuePass] = useState('');

    const changeLogin = (e) => {
        setError(false);
        setValueLogin(e.target.value);
    }

    const changePass = (e) => {
        setError(false);
        setValuePass(e.target.value);
    }

    const cancelModal = () => {
        setValueLogin('');
        setValuePass('');
        setError(false);
        setAuthModals(false)
    }

    useEffect(() => {
        setValueLogin('');
        setValuePass('');
    }, [authModals])

    return (
        <div className={authModals ? 'Authmodal show' : 'Authmodal'}>
            <div className='modal__cancel' onClick={() => cancelModal()}>X</div>
            <div className='modal__title'>{authModals === 1 ? 'login chat' : 'registration'}</div>
            <div className='error__output'>{error}</div>
            <form className='modal__form' onSubmit={(e) => authQuery(e, valueLogin, valuePass)}>
                <div className='modal__input__wrapper'>
                    <span className='modal__label'>name</span>
                    <input type='text' className={error ? 'modal__input error' : 'modal__input'} maxLength='22' onChange={(e) => changeLogin(e)} value={valueLogin} />
                </div>
                <div className='modal__input__wrapper'>
                    <span className='modal__label'>pass</span>
                    <input type='password' className={error ? 'modal__input error' : 'modal__input'} maxLength='25' onChange={(e) => changePass(e)} value={valuePass} />
                </div>
                <button className='modal__button'>
                    {authModals === 1 ? 'login' : 'register'}
                </button>
            </form>
        </div>
    )
}

export default Authmodal;
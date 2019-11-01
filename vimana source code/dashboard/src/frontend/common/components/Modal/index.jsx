import React from 'react';
import style from './style.scss';

import Backdrop from '../Backdrop';
import { hideModalAction, deleteAccount } from '../../../dashboard/ducks/main';

const Modal = ({ show, dispatch }) => (
    <div
        className={`${style.wrapper} ${show ? style.show : style.hide}`}
        onClick={() => dispatch(hideModalAction())}
    >
        {show && <Backdrop />}
        <div className={style.modal}>
            <p>Are you sure want to delete account ?</p>
            <div className={style.btns}>
                <button type="button" onClick={() => dispatch(hideModalAction())}>
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={() => dispatch(deleteAccount())}
                    className={style.delete_acc}
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
);

export default Modal;

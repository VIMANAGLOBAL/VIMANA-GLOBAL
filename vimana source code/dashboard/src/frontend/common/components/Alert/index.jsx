import React from 'react';
import style from './style.scss';

const Notification = ({ alert: { title, type } }) => (
    <div className={`${style.wrapper} ${style[type]}`}>
        <h3>{title}</h3>
    </div>
);

export default Notification;

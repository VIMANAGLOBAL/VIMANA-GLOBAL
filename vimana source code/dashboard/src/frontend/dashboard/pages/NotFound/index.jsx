import React from 'react';
import style from './style.scss';
import 'react-datepicker/dist/react-datepicker.css';

const NotFound =() => (
    <div className={style.wrapper}>
        <h4>
            404<br />
            Page is not found
        </h4>

        <div className={style.info_message}>
            Please check the url, or visit home page
        </div>
    </div>
);

export default NotFound;

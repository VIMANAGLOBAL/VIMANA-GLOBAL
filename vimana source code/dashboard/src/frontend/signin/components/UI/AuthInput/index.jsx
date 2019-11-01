import React from 'react';
import style from './style.scss';

const AuthInput = ({ input, type, meta, placeholder, whiteColor }) => (
    <div
        className={`${style.wrapper} ${whiteColor && style.white} ${meta.error &&
            meta.touched &&
            'error'}`}
    >
        <input
            className={`${style.input}`}
            {...input}
            type={type}
            autoComplete="new-password"
            placeholder={placeholder}
        />
    </div>
);

export default AuthInput;

import React from 'react';
import style from './style.scss';

const BuyTokenInput = (field) => (
    <div className={`${style.wrapper} ${field.meta.error && field.meta.touched && 'error'}`}>
        <input
            {...field.input}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
        />
    </div>
);

export default BuyTokenInput;

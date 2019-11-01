import React from 'react';
import style from './style.scss';

const TextInput = (field) => (
    <div className={`${style.wrapper} ${field.meta.error && field.meta.touched && 'error' || ''}`}>
        <label>{field.label}</label>
        <input {...field.input} type={field.type} autoComplete="new-password" />
    </div>
);

export default TextInput;

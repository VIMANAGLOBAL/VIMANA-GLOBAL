import React from 'react';
import style from './style.scss';

const Button = ({ value, click }) => (
    <button type="button" onClick={click}>
        {value}
    </button>
    );

export default Button;

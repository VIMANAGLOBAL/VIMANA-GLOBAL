import React from 'react';
import style from './style.scss';

const FACheckbkox = (field) => (
    <div className={style.wrapper}>
        <p>{field.label}</p>
        <div className={style.input_wrapper}>
            <label>
                <input
                    {...field.input}
                    type="radio"
                    value="true"
                    name="radio"
                    checked={field.input.value === 'true'}
                />
                <span>Enable</span>
            </label>
            <label>
                <input
                    {...field.input}
                    type="radio"
                    value="false"
                    name="radio"
                    checked={field.input.value === 'false'}
                />
                <span>Disable</span>
            </label>
        </div>
    </div>
);

export default FACheckbkox;

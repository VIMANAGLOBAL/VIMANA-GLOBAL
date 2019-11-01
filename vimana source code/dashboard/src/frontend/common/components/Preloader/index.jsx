import React from 'react';
import style from './style.scss';

const Preloader = () => {
    return (
        <div className={style.wrapper}>
            <div className={style.loader} />;
        </div>
    );
};

export default Preloader;

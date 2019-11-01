import React from 'react';
import style from './style.scss';

import Countdown from 'react-countdown-now';

const renderer = ({ days, hours, minutes, seconds }) => (
    <span>{`${days}D ${hours}H ${minutes}:${seconds}`}</span>
);

const ProgressBar = ({ date }) => (
    <div className={style.wrapper}>
        <Countdown date={date} renderer={renderer} />
        <div className={style.progress}>
            <div>
                <div className={style.mark}>
                    <i />
                </div>
            </div>
        </div>
        <p>Reached $150.5</p>
    </div>
);

export default ProgressBar;

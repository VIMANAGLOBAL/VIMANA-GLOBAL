import React from 'react';
import style from './style.scss';

import THead from './THead';
import TBody from './TBody';

const Table = ({ data, dispatch, count }) => (
    <table className={style.wrapper}>
        <THead />
        <TBody dispatch={dispatch} data={data} count={count} />
    </table>
);

export default Table;

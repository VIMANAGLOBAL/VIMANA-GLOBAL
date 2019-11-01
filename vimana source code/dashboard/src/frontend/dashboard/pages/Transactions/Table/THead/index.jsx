import React from 'react';
import style from './style.scss';

const THead = () => (
    <thead>
        <tr>
            <td className="column1">ID</td>
            <td className="column2">Agent</td>
            <td className="column3">Amount</td>
            <td className="column4">Tokens</td>
            <td className="column5">Bonus</td>
            <td className="column6">Currency Rate</td>
            <td className="column7">ID from bank</td>
            <td className="column8">Time</td>
        </tr>
    </thead>
);

export default THead;

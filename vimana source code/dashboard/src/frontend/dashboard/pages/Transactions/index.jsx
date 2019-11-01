import React from 'react';
import style from './style.scss';

import Table from './Table';

import { connect } from 'react-redux';

const Transactions = ({ dispatch, transactions, count }) => (
    <div className={style.wrapper}>
        <h4>
            List <br /> of Transactions
        </h4>
        <Table data={transactions} dispatch={dispatch} count={count} />
    </div>
);

const mapStateToProps = ({ main }) => ({
    transactions: main.transactions,
    count: main.transactionsCount
});

export default connect(mapStateToProps)(Transactions);

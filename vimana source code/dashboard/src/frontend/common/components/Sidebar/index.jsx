import React from 'react';
import style from './style.scss';

import Logo from '../Logo';
import Nav from '../Nav';

import { logout } from '../../../dashboard/ducks/main';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

const Sidebar = ({ dispatch, email, country, balance, disabled, click, firstName, lastName, investment }) => (
    <aside>
        <div className={style.info}>
            <Logo />
            {/* <div className={style.info_top}>
                <p>{balance}</p>
                <span>Vair</span>
                <span>Total Balance</span>
            </div> */}
            <div className={style.info_bot}>
                <div>
                    <p>{firstName} {lastName}</p>
                </div>
                <div>
                    <p>{email}</p>
                    <span className={style.logout} onClick={() => dispatch(logout())}>
                        Logout
                    </span>
                </div>
                {investment && investment.amount && parseInt(investment.amount) > 0 &&
                    <div>
                        <p>Initial Interest: {investment.amount} {investment.currency}</p>
                    </div>
                }
            </div>
        </div>
        <Nav disabled={disabled} click={click} />
    </aside>
);

const mapStateToProps = ({ info }) => ({
    email: info.email,
    country: info.country,
    balance: info.balance,
    firstName: info.firstName,
    lastName: info.lastName,
    investment: info.investment,
});

export default withRouter(connect(mapStateToProps)(Sidebar));

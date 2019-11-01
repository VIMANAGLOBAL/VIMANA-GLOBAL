import React from 'react';
import style from './style.scss';

import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';

const Header = ({ location: { pathname }, email }) => {
    const handleRender = () => {
        switch (pathname) {
            case '/dashboard':
                return [
                    <span className={style.hidden} key={1}>
                        Soft Cap $25M
                    </span>,
                    <span className={style.hidden} key={2}>
                        Hard Cap $150M
                    </span>
                ];
            case `/dashboard/transactions`:
                return (
                    <span className={style.date}>
                        {moment(new Date()).format('DD MMM YYYY, HH:mm')}
                    </span>
                );
            case `/terms-conditions`:
                return (
                    <span className={style.t_c}>
                        Conditions <br /> for Vimana tokens purchasing:
                    </span>
                );
            default:
        }
    };
    const isTermsPage = pathname === `/terms_conditions`;
    return (
        <div className={`${style.header} ${isTermsPage && style.header_custom}`}>
            <div className={style.left}>{handleRender()}</div>
            {isTermsPage ? null : (
                <div className={style.right}>
                    <a rel="noopener noreferrer" href="https://vimana.global/">VBAN</a>
                    <a target="_blank" rel="noopener noreferrer" href="https://vimana.global/vtolaav">
                        VTOL AAV
                    </a>
                </div>
            )}
        </div>
    );
};

export default withRouter(Header);

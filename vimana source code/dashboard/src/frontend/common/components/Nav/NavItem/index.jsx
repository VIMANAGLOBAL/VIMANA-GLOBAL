import React from 'react';
import style from './style.scss';

import { NavLink } from 'react-router-dom';

const NavItem = ({ value, disabled }) =>
    disabled ? (
        <span className={`${style.link} ${style.disabled}`}>{value}</span>
    ) : (
        <NavLink
            activeClassName={style.active}
            className={style.link}
            to={value === 'dashboard' ? '/dashboard' : `/dashboard/${value}`}
            exact={value === 'dashboard'}
        >
            {value}
        </NavLink>
    );

export default NavItem;

import React from 'react';
import style from './style.scss';

import NavItem from './NavItem';
import { Link, withRouter, NavLink} from 'react-router-dom';

const Nav = ({ disabled, click }) => (
    <nav className={style.nav} onClick={click}>
        <NavItem value="dashboard" disabled={disabled} />
        <NavItem value="settings" disabled={disabled} />
    </nav>
);

export default withRouter(Nav);

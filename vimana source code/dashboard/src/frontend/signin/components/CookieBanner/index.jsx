import React, { Component } from 'react';
import style from './style.scss';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { cookieAgreeAction } from '../../ducks';

class CookieBanner extends Component {
    handleCookieAgree = () => {
        document.cookie = 'cookieAgree=true;path=/';
        this.props.dispatch(cookieAgreeAction());
    };

    render() {
        const { cookieAgree: agree } = this.props;
        return (
            <div className={`${style.wrapper} ${agree ? style.hide : ''}`}>
                <p>
                    This website uses cookies to ensure you get the best experience on our website.
                </p>
                <Link to="/cookie-policy">More info</Link>
                <button type="button" onClick={this.handleCookieAgree}>
                    Got it!
                </button>
            </div>
        );
    }
}

const mapStateToProps = ({ auth }) => ({
    cookieAgree: auth.cookieAgree
});

export default connect(mapStateToProps)(CookieBanner);

import React, { Component } from 'react';
import style from './style.scss';

import { getCookie } from '../../../common/helpers/cookie';
import { Link } from 'react-router-dom';

class Success extends Component {
    componentDidMount = () => {
        const succeed = getCookie('succeed');
        const verified = getCookie('verified');
        if ((!succeed && !verified) || (succeed !== 'true' && verified !== 'true')) {
            return this.props.history.push('/login');
        }
        if (succeed === 'true') {
            document.cookie = 'succeed=false;path=/';
        }
        if (verified === 'true') {
            document.cookie = 'verified=false;path=/';
        }
    };

    handleRenderText = () => {
        const { type } = this.props.match.params;

        switch (type) {
            case 'verify':
                return 'Your account verified successfully. Now you can login';
            case 'resend':
            case 'register':
                return 'Verification link was sent to your email';
            case 'recover':
                return 'Password was sent to your email';
            case 'not-found':
            case 'verification-code-not-valid':
                return "Check link you moved to: probably it isn't equal to link you got in letter";
            case 'expired':
                return 'Link you moved to is expired. Request another one on a login page';
            default:
                return `Something went wrong on our side ${<br />} 
                        Try to request another verification letter on a login page`;
        }
    };

    handleRenderHeader = () => {
        const { isSuccess } = this.props.match.params;

        switch (isSuccess) {
            case 'success':
                return 'Success!';
            default:
                return 'Failed!';
        }
    };

    render() {
        const { type } = this.props.match.params;

        return (
            <div className={style.wrapper}>
                <h4>{this.handleRenderHeader()}</h4>
                <br />
                <h6>{this.handleRenderText()}</h6>
                {type === 'register' ? null : <Link to="/login">Login</Link>}
            </div>
        );
    }
}

export default Success;

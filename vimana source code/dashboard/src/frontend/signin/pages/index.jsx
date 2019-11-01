import React from 'react';
import style from './style.scss';

import Login from './Login';
import Register from './Register';
import Success from './Success';
import CookiePolicy from './CookiePolicy';
import PrivacyPolicy from './PrivacyPolicy';
import Preloader from '../../common/components/Preloader';
import Alert from '../../common/components/Alert';
import CookieBanner from '../components/CookieBanner';

import { getCookie } from '../../common/helpers/cookie';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

const Auth = ({ isFetching, showPreloader }) => (
    <React.Fragment>
        <div className={style.wrapper}>
            <Switch>
                <Redirect from="/" to="/login" exact />
                <Route path="/login" component={Login} />
                <Route
                    path="/register"
                    render={(props) => <Register {...props} isFetching={isFetching} />}
                />
                <Route path="/cookie-policy" component={CookiePolicy} />
                <Route path="/privacy-policy" component={PrivacyPolicy} />
                <Route path="/:isSuccess/:type" component={Success} />
            </Switch>
        </div>
        {!getCookie('cookieAgree') && <CookieBanner />}
        {isFetching && showPreloader && <Preloader />}
        {alert.show && <Alert alert={alert} />}
    </React.Fragment>
);

const mapStateToProps = ({ auth }) => ({
    isFetching: auth.isFetching,
    showPreloader: auth.showPreloader,
    alert: auth.alert
});

export default connect(mapStateToProps)(Auth);

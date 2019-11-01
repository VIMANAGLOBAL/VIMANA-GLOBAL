import React, { Component } from 'react';
import style from './style.scss';

import Sidebar from '../../common/components/Sidebar';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import Settings from './Settings';
import NotFound from './NotFound';
// import BuyToken from './BuyToken';
import Onfido from './Onfido';
import Header from '../../common/components/Header';
import Preloader from '../../common/components/Preloader';
import Alert from '../../common/components/Alert';

import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUserInfo, getBalanceInfo, getInvestmentInfo } from '../ducks/info';
// import { getCrowdsaleDate } from '../ducks/main';

class App extends Component {
    componentDidMount = () => {
        const { dispatch } = this.props;

        dispatch(getUserInfo());
        dispatch(getBalanceInfo());
        dispatch(getInvestmentInfo());
        // dispatch(getCrowdsaleDate());
    };

    render() {
        const {
            alert,
            isFetching,
            isLocked,
            email,
            match: { url }
        } = this.props;
        return (
            <div className={style.wrapper}>
                <Sidebar />
                <main>
                    <div className={style.scroll} id="scroll">
                        <Header email={email} />
                        <Switch>
                            <Route path={url} component={Dashboard} exact />
                            <Route path={`${url}/transactions`} component={Transactions} />
                            <Route
                                path={`${url}/settings`}
                                render={(props) => <Settings {...props} />}
                            />
                            {/* <Route path={`${url}/verify`} component={Onfido} /> */}

                            <Route component={NotFound} />
                        </Switch>
                    </div>
                </main>
                {(isFetching || isLocked) && <Preloader />}
                {alert.show && <Alert alert={alert} />}
            </div>
        );
    }
}

const mapStateToProps = ({ main, info }) => ({
    isLocked: info.isLocked,
    isFetching: main.isFetching,
    alert: main.alert,
    email: info.email
});

export default connect(mapStateToProps)(App);

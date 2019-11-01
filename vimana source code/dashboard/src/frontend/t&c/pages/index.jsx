import React, { Component } from 'react';
import style from './style.scss';

import Terms from './Terms';
import Header from '../../common/components/Header';
import Sidebar from '../../common/components/Sidebar';
import Alert from '../../common/components/Alert';

import { error } from '../../common/helpers/alert';
import { connect } from 'react-redux';
import { getUserInfo, getBalanceInfo, showAlertAction } from '../ducks/info';

class App extends Component {
    componentDidMount = () => {
        const { dispatch } = this.props;
        dispatch(getUserInfo());
        dispatch(getBalanceInfo());
    };

    render() {
        const { alert, dispatch } = this.props;

        return (
            <div className={style.wrapper}>
                <Sidebar
                    disabled
                    click={() => dispatch(showAlertAction({ title: error, type: 'error' }))}
                />
                <main>
                    <Header />
                    <Terms dispatch={dispatch} />
                </main>
                {alert.show && <Alert alert={alert} />}
            </div>
        );
    }
}

const mapStateToProps = ({ info }) => ({
    alert: info.alert
});

export default connect(mapStateToProps)(App);

import React from 'react';
import { connect } from 'react-redux';
import { changePassword, changeUsername, login } from '../actions';
import { SigninForm } from '../components/SigninForm';

class Main extends React.Component {
    login = () => {
        this.props.login(this.props.username, this.props.password);
    };

    render() {
        const {
            locked,
            failed,
            errorCode,
            username,
            password,
            submitDisabled,
            changeUsername,
            changePassword
        } = this.props;

        return (
            <SigninForm
                locked={locked}
                failed={failed}
                errorCode={errorCode}
                username={username}
                password={password}
                submitDisabled={submitDisabled}
                onUsernameChange={changeUsername}
                onPasswordChange={changePassword}
                onSubmit={this.login}
            />
        );
    }
}

const mapState2props = (state) => ({
    locked: state.locked,
    failed: state.failed,
    errorCode: state.errorCode,
    username: state.username,
    password: state.password,
    submitDisabled: state.submitDisabled
});

const mapDispatch2props = {
    changeUsername,
    changePassword,
    login
};

export default connect(
    mapState2props,
    mapDispatch2props
)(Main);

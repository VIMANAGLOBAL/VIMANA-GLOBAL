import style from './SigninForm.scss';

import React from 'react';
import PropTypes from 'prop-types';

import { Input } from '../../common/components/Input';
import { Button } from '../../common/components/Button';
import { Alert } from '../../common/components/Alert';
import { resolveErrorCode } from '../../common/util/errorCodeResolver';

export class SigninForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            failed,
            errorCode,

            username,
            password,
            submitDisabled,

            onSubmit,
            onUsernameChange,
            onPasswordChange
        } = this.props;

        return (
            <div className={style.wrapper}>
                <Input label="Username" value={username} onChange={onUsernameChange} />
                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={onPasswordChange}
                    onKeyPress={this.onKeyPress}
                />
                <Button label="Login" disabled={submitDisabled} onClick={onSubmit} />
                <Alert visible={!!(failed && errorCode)} text={resolveErrorCode(errorCode)} />
            </div>
        );
    }

    onKeyPress = e => {
        console.error(e.keyCode)
        if (e.keyCode === 13) {
            this.props.onSubmit();
        }
    }
}

SigninForm.propTypes = {
    locked: PropTypes.bool.isRequired,

    failed: PropTypes.bool.isRequired,
    errorCode: PropTypes.string.isRequired,

    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,

    submitDisabled: PropTypes.bool.isRequired,

    onUsernameChange: PropTypes.func.isRequired,
    onPasswordChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

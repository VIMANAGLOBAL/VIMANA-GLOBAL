import React, { Component } from 'react';
import style from './style.scss';

import AuthInput from '../../components/UI/AuthInput';
import ForgotPassword from '../ForgotPassword';

import { connect } from 'react-redux';
import { loginSubmit } from '../../ducks';
import { Field, reduxForm, Form, clearSubmitErrors, clearFields } from 'redux-form';
import { email, required } from '../../../common/helpers/validation';

class Login extends Component {
    constructor() {
        super();
        this.wrapperRef = React.createRef();

        this.state = {
            showModal: false,
            isVerify: false
        };
    }

    handleShowModal = (verify) => {
        if (verify) {
            this.setState({ showModal: true, isVerify: true });
            return;
        }
        this.setState({ showModal: true, isVerify: false });
    };

    handleHideModal = () => {
        this.setState({ showModal: false });
        setTimeout(
            () => this.props.dispatch(clearFields('forgotPassword', false, false, 'email')),
            1000
        );
    };

    handleTransition = () => {
        this.wrapperRef.current.classList.add(style.transitting);
        setTimeout(() => this.props.history.push(`/register`), 1500);
    };

    resetError = () => {
        const { submitFailed, dispatch, invalid } = this.props;
        if (submitFailed && invalid) {
            dispatch(clearSubmitErrors('login'));
        }
    };

    render() {
        const { handleSubmit, dispatch, enabled2FA, isFetching, valid, cookieAgree } = this.props;
        const { showModal, isVerify } = this.state;

        return (
            <div className={style.wrapper} ref={this.wrapperRef}>
                <div className={style.header}>
                    <h4>Sign In</h4>
                </div>
                <Form
                    onSubmit={handleSubmit((value) => dispatch(loginSubmit(value)))}
                    className={style.form}
                    onChange={this.resetError}
                >
                    <Field
                        name="email"
                        type="email"
                        component={AuthInput}
                        placeholder="Email"
                        validate={[required, email]}
                    />
                    <Field
                        name="password"
                        type="password"
                        component={AuthInput}
                        placeholder="Password"
                        validate={[required]}
                    />
                    {enabled2FA && (
                        <Field
                            name="token"
                            type="password"
                            component={AuthInput}
                            placeholder="2FA"
                        />
                    )}

                    <div className={style.button_wrapper}>
                        <button
                            type="submit"
                            className={!valid || !cookieAgree ? 'disabled' : ''}
                            disabled={isFetching || !cookieAgree}
                        >
                            Sign In
                        </button>
                    </div>
                </Form>
                <div className={style.link_wrapper} onClick={this.handleTransition}>
                    <div className={style.inner_div}>
                        <span>Sign Up</span>
                    </div>
                </div>
                <div className={style.forgot_password}>
                    <span onClick={() => this.handleShowModal(false)}>Forgot Password?</span>
                </div>
                <div className={`${style.forgot_password} ${style.resent_verify_email}`}>
                    <span onClick={() => this.handleShowModal(true)}>Verification?</span>
                </div>
                <ForgotPassword show={showModal} click={this.handleHideModal} isVerify={isVerify} />
            </div>
        );
    }
}

const mapStateToProps = ({ auth }) => ({
    enabled2FA: auth.enabled2FA,
    isFetching: auth.isFetching,
    cookieAgree: auth.cookieAgree
});

export default connect(mapStateToProps)(reduxForm({ form: 'login' })(Login));

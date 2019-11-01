import React from 'react';
import style from './style.scss';

import AuthInput from '../../components/UI/AuthInput';

import { connect } from 'react-redux';
import { required, email } from '../../../common/helpers/validation';
import { recoverSubmit, resentVerify } from '../../ducks';
import { Field, Form, reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';

const ForgotPassword = ({ show, click, handleSubmit, form, dispatch, isVerify, valid }) => (
    <div className={`${style.wrapper} ${show ? style.show : style.hide}`}>
        <span onClick={click}>Close</span>
        <Form
            onSubmit={handleSubmit((value) =>
                dispatch(isVerify ? resentVerify(value) : recoverSubmit(value))
            )}
            className={style.form}
        >
            <h4>{isVerify ? 'Resend Verification Email?' : 'Forgot password?'}</h4>
            <Field
                name="email"
                type="email"
                component={AuthInput}
                placeholder="Email"
                validate={[required, email]}
                whiteColor
            />

            <button
                className={`${form && form.values && style.draw} ${!valid ? 'disabled' : ''}`}
                type="submit"
            >
                {isVerify ? 'Resend' : 'Recover'}
            </button>
        </Form>
    </div>
);

const mapStateToProps = (state) => ({
    form: state.form.forgotPassword
});

export default withRouter(
    reduxForm({ form: 'forgotPassword' })(connect(mapStateToProps)(ForgotPassword))
);

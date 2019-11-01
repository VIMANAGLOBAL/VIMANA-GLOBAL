import React, { Component } from 'react';
import style from '../Login/style.scss';
import regStyle from './style.scss';

import AuthInput from '../../components/UI/AuthInput';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Field, reduxForm, Form } from 'redux-form';
import {
    email,
    required,
    passwordsMatch,
    minValue6,
    asyncValidate
} from '../../../common/helpers/validation';
import { country } from '../../../common/helpers/normalize';
import { registerSubmit } from '../../ducks';
import SelectInput from "../../../common/components/SelectInput";
import countriesList from "../../../dashboard/constants/countries";

class Register extends Component {
    constructor() {
        super();
        this.wrapperRef = React.createRef();
    }

    handleTransition = () => {
        this.wrapperRef.current.classList.add(regStyle.transitting);
        setTimeout(() => this.props.history.push('/login'), 1600);
    };

    render() {
        const { handleSubmit, dispatch, valid } = this.props;

        return (
            <div className={`${style.wrapper} ${regStyle.wrapper}`} ref={this.wrapperRef}>
                <div className={`${style.header} ${regStyle.header}`}>
                    <h4>Sign Up</h4>
                </div>
                <Form
                    onSubmit={handleSubmit((value) => dispatch(registerSubmit(value)))}
                    className={`${style.form} ${regStyle.form}`}
                >
                    <Field
                        name="firstName"
                        type="text"
                        component={AuthInput}
                        placeholder="First Name"
                        validate={[required]}
                        normalize={(val) => val.slice(0, 50)}
                    />
                    <Field
                        name="lastName"
                        type="text"
                        component={AuthInput}
                        placeholder="Last Name"
                        validate={[required]}
                        normalize={(val) => val.slice(0, 50)}
                    />
                    <Field
                        name="email"
                        type="email"
                        component={AuthInput}
                        placeholder="Email"
                        validate={[required, email]}
                        normalize={(val) => val.slice(0, 100)}
                    />
                    <Field
                        name="password"
                        type="password"
                        component={AuthInput}
                        placeholder="Create your Password"
                        validate={[required, minValue6]}
                        normalize={(val) => val.slice(0, 1000)}
                    />
                    <Field
                        name="confirm"
                        type="password"
                        component={AuthInput}
                        placeholder="Confirm your Password"
                        validate={[required, passwordsMatch, minValue6]}
                        normalize={(val) => val.slice(0, 1000)}
                    />
                    <Field
                        name="country"
                        placeholder="Country of Residence"
                        component={SelectInput}
                        optionsToRender={countriesList}
                        customWrapperClass="registerWrapperSelect"
                        customClass="registerSelect"
                        isSearchable
                        autocomplete="off"
                    />
                    <div className={`${regStyle.agreement} ${regStyle.cookie}`}>
                        <div>
                            <Field
                                name="cookiePolicy"
                                type="checkbox"
                                component="input"
                                id="cookiePolicy"
                                required
                            />
                            <label htmlFor="cookiePolicy">
                                I agree with &nbsp;
                                <Link to='/cookie-policy' target="_blank">
                                    Cookie Policy
                                </Link>
                            </label>
                        </div>
                    </div>
                    <div className={`${regStyle.agreement} ${regStyle.privacy}`}>
                        <div>
                            <Field
                                name="privacyPolicy"
                                type="checkbox"
                                component="input"
                                id="privacyPolicy"
                                required
                            />
                            <label htmlFor="privacyPolicy">
                                I agree with &nbsp;
                                <Link to='/privacy-policy' target="_blank">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                    </div>
                    <div className={`${style.button_wrapper} ${regStyle.button_wrapper}`}>
                        <button className={!valid ? 'disabled' : ''} type="submit">
                            Sign Up
                        </button>
                    </div>
                </Form>
                <div
                    className={`${style.link_wrapper} ${regStyle.link_wrapper}`}
                    onClick={this.handleTransition}
                >
                    <div className={`${style.inner_div} ${regStyle.inner_div}`}>
                        <span>Sign In</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(
    reduxForm({
        form: 'register',
        asyncValidate,
        asyncBlurFields: ['email']
    })(Register)
);

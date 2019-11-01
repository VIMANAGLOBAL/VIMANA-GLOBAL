import React, { Component } from 'react';
import style from './style.scss';

import TextInput from '../../../common/components/TextInput';
import FACheckbox from '../../../common/components/FACheckbox';
import TwoFA from './TwoFA';
import Modal from '../../../common/components/Modal';
import SelectInputMulti from '../../../common/components/SelectInputMulti';
import SelectInput from "../../../common/components/SelectInput";

import { animateScroll as scroll } from 'react-scroll';

import { connect } from 'react-redux';
import { saveSettings } from '../../ducks/info';
import { Form, Field, reduxForm, formValueSelector } from 'redux-form';
import { passwordsMatchSettings, minValue6, phone } from '../../../common/helpers/validation';
import { phoneNormalize } from '../../../common/helpers/normalize';
import { showModalAction } from '../../ducks/main';
import countriesList from "../../constants/countries";

const optionsToRender = [
    { value: 'INDIVIDUAL', label: 'Individual Investor' },
    { value: 'SYNDICATE', label: 'Syndicate' },
    { value: 'CRYPTO_FUND', label: 'Crypto Fund' },
    { value: 'VENTURE_FUND', label: 'Venture Fund' },
    { value: 'STRATEGIC_PARTNER', label: 'Strategic Partner' },
    { value: 'GOVERNMENT_ENTITY', label: 'Government Entity' }
];
class Settings extends Component {
    handleScrollToBottom = () => {
        scroll.scrollToBottom({
            containerId: 'scroll',
            isDynamic: true,
            duration: 350
        });
    };

    render() {
        const { handleSubmit, dispatch, enable2fa, dirty, showModal } = this.props;
        return (
            <div className={style.wrapper}>
                <h4>
                    Profile <br />
                    Settings
                </h4>
                <Form
                    onSubmit={handleSubmit((value) => dispatch(saveSettings(value, dirty)))}
                    autoComplete="off"
                >
                    <div className={style.personal_data}>
                        <h5>Personal Data</h5>
                        <Field
                            name="firstName"
                            type="text"
                            component={TextInput}
                            placeholder="First Name"
                            label="First Name"
                            normalize={(val) => val.slice(0, 200)}
                        />
                        <Field
                            name="lastName"
                            type="text"
                            component={TextInput}
                            placeholder="Last Name"
                            label="Last Name"
                            normalize={(val) => val.slice(0, 200)}
                        />
                        <Field
                            name="address"
                            type="text"
                            component={TextInput}
                            placeholder="Address"
                            label="Address"
                            normalize={(val) => val.slice(0, 200)}
                        />
                        <Field
                            name="city"
                            type="text"
                            component={TextInput}
                            placeholder="City"
                            label="City"
                            normalize={(val) => val.slice(0, 200)}
                        />
                        <Field
                            name="state"
                            type="text"
                            component={TextInput}
                            placeholder="State"
                            label="State"
                            normalize={(val) => val.slice(0, 200)}
                        />
                        <Field
                            name="zipCode"
                            type="text"
                            component={TextInput}
                            placeholder="Zip Code"
                            label="Zip Code"
                            normalize={(val) => val.slice(0, 20)}
                        />
                        <Field
                            label="Country of Residence"
                            name="country"
                            component={SelectInput}
                            optionsToRender={countriesList}
                            customClass="registerSelect"
                            isSearchable
                        />
                        <Field
                            name="phone"
                            type="text"
                            component={TextInput}
                            placeholder="Phone"
                            label="Phone"
                            normalize={(val) => phoneNormalize(val)}
                            validate={phone}
                        />
                        <Field
                            label="Choose option that best describe you"
                            name="description"
                            component={SelectInputMulti}
                            optionsToRender={optionsToRender}
                            customClass="registerSelect"
                            multi={false}
                        />
                    </div>
                    <div className={style.security_data}>
                        <h5>Change Password</h5>
                        <Field
                            name="currentPass"
                            type="password"
                            component={TextInput}
                            label="Current password"
                            validate={[minValue6]}
                            normalize={(val) => val.slice(0, 1000)}
                        />
                        <Field
                            name="newPass"
                            type="password"
                            component={TextInput}
                            label="New password"
                            validate={[minValue6]}
                            normalize={(val) => val.slice(0, 1000)}
                        />
                        <Field
                            name="confirm"
                            type="password"
                            component={TextInput}
                            label="Confirm new password"
                            normalize={(val) => val.slice(0, 1000)}
                            validate={[passwordsMatchSettings, minValue6]}
                        />
                        <Field
                            name="enable2fa"
                            component={FACheckbox}
                            label="2-factor Authentication"
                            click={this.handleScrollToBottom}
                        />
                        <div
                            className={`${style.FA} ${
                                enable2fa === 'true' ? style.show : style.hide
                            }`}
                        >
                            <TwoFA show={enable2fa} />
                        </div>
                    </div>
                    <div className={style.buttons}>
                        <button type="submit">save changes</button>
                        <button
                            type="button"
                            className={style.delete_acc}
                            onClick={() => dispatch(showModalAction())}
                        >
                            delete account
                        </button>
                    </div>
                </Form>
                <Modal show={showModal} dispatch={dispatch} />
            </div>
        );
    }
}

const selector = formValueSelector('changePassword');

const mapStateToProps = (state) => ({
    enable2fa: selector(state, 'enable2fa'),
    initialValues: {
        enable2fa: `${state.info.enable2fa}`,
        description: state.info.description[0],
        address: state.info.address,
        city: state.info.city,
        phone: state.info.phone,
        state: state.info.state,
        zipCode: state.info.zipCode,
        country: state.info.country,
        firstName: state.info.firstName,
        lastName: state.info.lastName,
    },
    showModal: state.main.modal.show
});

export default connect(mapStateToProps)(
    reduxForm({
        form: 'changePassword',
        touchOnChange: true,
        enableReinitialize: true
    })(Settings)
);

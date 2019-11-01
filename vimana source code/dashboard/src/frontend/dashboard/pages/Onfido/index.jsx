import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from "moment";
import {change, Field, Form, reduxForm} from 'redux-form';
import {NavLink} from 'react-router-dom';
import Dropzone from "react-dropzone";
import Recaptcha from "react-recaptcha";
import DatePicker from 'react-datepicker';
import style from './style.scss';
import dpStyle from './datepicker.scss';
import 'react-datepicker/dist/react-datepicker.css';
import countriesList from '../../constants/countries';

import TextInput from '../../../common/components/TextInput';
import Modal from '../../../common/components/Modal';
import SelectInput from "../../../common/components/SelectInput";
import documentName2documentTypeUtil from "../../util/documentName2documentTypeUtil";
import documentMapUtil from "../../util/verificationDocumentMapUtil";
import {verifyUser} from '../../ducks/info';
import {typeFileError} from "../../../common/helpers/alert";
import {showAlertAction} from "../../ducks/main";
import {phoneNormalize} from "../../../common/helpers/normalize";
import {email, phone, required} from "../../../common/helpers/validation";

const renderDatePicker = ({input, placeholder, defaultValue, meta: {touched, error} }) => (
    <div className={`${dpStyle.datePickerWrapper} ${error && touched && 'error' || ''}`}>
        <label>Birthday</label>
        <DatePicker
            {...input}
            maxDate={moment()}
            scrollableYearDropdown
            showMonthDropdown
            yearDropdownItemNumber={100}
            showYearDropdown
            dateFormat="YYYY/MM/DD"
            dateFormatCalendar="YYYY/MM/DD"
            selected={input.value ? moment(input.value) : null}
        />
    </div>
);

class Onfido extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verified: false
        };
    }

    handleFileUpload = (files) => {
        const {formState} = this.props;
        let newFiles = files;

        if (formState && formState.values && formState.values.files) {
            newFiles = formState.values.files.concat(files);
        }

        if (newFiles.length > 5) {
            newFiles.splice(5);
        }
        this.props.dispatch(change('verifyUser', 'files', newFiles));
    };

    handleDropRejected = () => {
        this.props.dispatch(showAlertAction({title: typeFileError, type: 'error'}));
    };

    handleVerifyCallback = () => {
        this.setState({verified: true});
    };

    handleExpiredCallback = () => {
        this.setState({verified: false});
    };

    handleDeleteFileButtonClick = (e) => {
        e.stopPropagation();

        const {formState} = this.props;
        const index = e.target.id;

        if (formState && formState.values && formState.values.files) {
            const {files} = formState.values;
            const newFiles = files.slice();
            newFiles.splice(index, 1);
            this.props.dispatch(change('verifyUser', 'files', newFiles));
        }
    };

    renderForm() {
        const {handleSubmit, dispatch, dirty, formState} = this.props;
        const identificationTypeOptions = [];
        const {country, files, birthday} = formState && formState.values || {};
        if (country) {
            if (country !== "RUS") {
                identificationTypeOptions.push({
                    label: "Passport",
                    value: documentName2documentTypeUtil("Passport")
                });
            }

            const additionalDocuments = documentMapUtil(country);
            for (const name of additionalDocuments) {
                identificationTypeOptions.push({label: name, value: documentName2documentTypeUtil(name)});
            }
        }

        console.log(this.state.date, birthday);
        return (
            <Form
                onSubmit={handleSubmit((value) => dispatch(verifyUser(value, dirty)))}
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
                        validate={required}
                        normalize={(val) => val.slice(0, 200)}
                    />
                    <Field
                        name="lastName"
                        type="text"
                        component={TextInput}
                        placeholder="Last Name"
                        label="Last Name"
                        validate={required}
                        normalize={(val) => val.slice(0, 200)}
                    />
                    <Field
                        name="email"
                        type="text"
                        component={TextInput}
                        placeholder="E-mail"
                        label="E-mail"
                        validate={[required, email]}
                        normalize={(val) => val.slice(0, 100)}
                    />
                    <Field
                        name="phone"
                        type="text"
                        component={TextInput}
                        placeholder="Phone"
                        label="Phone"
                        normalize={(val) => phoneNormalize(val)}
                        validate={[required, phone]}
                    />
                    <Field
                        name="birthday"
                        type="text"
                        component={renderDatePicker}
                        placeholder="Birthday"
                        label="Birthday"
                        validate={required}
                    />
                    {/* <div className={dpStyle.datePickerWrapper}>
                        <label>Birthday</label>
                        <SingleDatePicker
                            date={this.state.date}
                            onDateChange={date => this.setState({ date })}
                            focused={this.state.focused}
                            onFocusChange={({ focused }) => this.setState({ focused })}
                            id="birthday"
                            name="birthday"
                            noBorder
                            block
                            numberOfMonths={1}
                            displayFormat="YYYY-MM-DD"
                            placeholder="YYYY-MM-DD"
                        />
                    </div> */}
                    {/* <Field
                        name="birthday"
                        type="text"
                        component={TextInput}
                        placeholder="Birthday"
                        label="Birthday"
                        validate={required}
                        normalize={(val) => val.slice(0, 20)}
                    /> */}
                    <Field
                        label="Country of Residence"
                        name="country"
                        component={SelectInput}
                        optionsToRender={countriesList}
                        customClass="registerSelect"
                        multi={false}
                        validate={required}
                        isSearchable
                    />
                    <Field
                        label="Document type"
                        name="identificationType"
                        component={SelectInput}
                        optionsToRender={identificationTypeOptions}
                        customClass="registerSelect"
                        multi={false}
                        validate={required}
                    />
                    <div className={style.dropzone_wrapper}>
                        <Dropzone
                            multiple
                            disabled={files && files.length >= 5}
                            accept="image/jpeg, image/png"
                            className={style.dropzone_block}
                            activeClassName={style.dropzone_block_active}
                            onDrop={this.handleFileUpload}
                            onDropRejected={this.handleDropRejected}
                        >
                            {files ? files.map((i, index) =>
                                (
                                    <div
                                        className={style.dropzone_preview}
                                        key={index}
                                    >
                                        <span
                                            id={index}
                                            className={style.delete_file_btn}
                                            onClick={this.handleDeleteFileButtonClick}
                                        />
                                        <img src={i.preview} />
                                        <span className={style.file_info}>{i.name}</span>
                                    </div>
                                ))
                                : (
                                    <span>
                                        Drag image or click here to upload
                                    </span>
                                )
                            }
                        </Dropzone>
                    </div>
                </div>
                <Recaptcha
                    sitekey={process.env.RECAPTCHA_KEY}
                    theme="dark"
                    verifyCallback={this.handleVerifyCallback}
                    expiredCallback={this.handleExpiredCallback}
                />
                <div className={style.buttons}>
                    <button type="submit" disabled={!this.state.verified}>Proceed KYC/AML</button>
                </div>
            </Form>
        )
    }

    render() {
        const {dispatch, showModal, kyc} = this.props;

        return (
            <div className={style.wrapper}>
                {kyc.loaded && (kyc.passed ?
                    <h4>KYC is complete!</h4>
                    :
                    <h4>Please complete the KYC/AML<br />process below:</h4>
                )}
                {kyc.inProgress &&
                (
                    <div className={style.info_message}>
                        At the moment you have an unfinished check.
                        <br />
                        Wait until it's over before create a new one or buy tokens.
                    </div>
                )}
                {kyc.passed &&
                    <div className={style.info_message}>
                        Please proceed below to purchase VAIR tokens:<br />
                        <NavLink
                            className={style.disabledButton}
                            to='/dashboard'
                        >
                            Purchase VAIR
                        </NavLink>
                    </div>
                }
                {kyc.failed && <div className={style.error_message}>Your KYC was reject because of incorrect data.</div>}
                {kyc.loaded && !kyc.inProgress && !kyc.passed && this.renderForm()}
                <Modal show={showModal} dispatch={dispatch} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    formState: state.form.verifyUser,
    kyc: state.info.kyc,
    initialValues: {
        firstName: state.info.firstName,
        lastName: state.info.lastName,
        email: state.info.email,
        phone: state.info.phone,
    },
    showModal: state.main.modal.show
});

export default connect(mapStateToProps)(
    reduxForm({
        form: 'verifyUser',
        touchOnChange: true,
        enableReinitialize: true
    })(Onfido)
);

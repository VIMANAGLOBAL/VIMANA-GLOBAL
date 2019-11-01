import React, {Component} from 'react';
import style from './style.scss';

import TokenSelect from '../../../../common/components/BuyTokenSelect';
import TokenInput from '../../../../common/components/BuyTokenInput';

import {connect} from 'react-redux';
import {Field, Form, reduxForm} from 'redux-form';
import {NavLink} from 'react-router-dom';
import {buyTokens, clearSubmitForm} from '../../../ducks/main';
import {onlyDigits} from '../../../../common/helpers/normalize';

const optionsToRender = [
    {value: 'BTC', label: 'BTC'},
    {value: 'BCH', label: 'BCH'},
    {value: 'ETH', label: 'ETH'},
    {value: 'EUR', label: 'EUR'},
    {value: 'USD', label: 'USD'}
];

class Investments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submited: false
        }
    }

    componentWillUnmount() {
        this.props.dispatch(clearSubmitForm());
    }

    handleSubmitForm = (value) => {
        this.props.dispatch(buyTokens(value));
        this.setState({submited: true});
    };

    render() {
        const {handleSubmit, investment, submitedForm} = this.props;
        return (
            <div className={style.wrapper}>
                {(this.state.submited && submitedForm) ?
                    <p>
                        Thank you! Your initial indication of interest for VAIR token purchase has been received
                    </p>
                    :
                    <p>
                        Thank you for your interest in VIMANA Blockchain Airspace Network (VBAN).<br />
                        Please indicate your level of interest in the VAIR token allocation below:
                    </p>
                }
                <Form
                    onSubmit={handleSubmit(this.handleSubmitForm)}
                    autoComplete="off"
                    className={style.form}
                >
                    <Field
                        name="amount"
                        type="text"
                        component={TokenInput}
                        placeholder="Amount"
                        normalize={(val) => onlyDigits(val)}
                        required
                    />
                    <Field
                        name="currency"
                        component={TokenSelect}
                        optionsToRender={optionsToRender}
                    />
                    <button type="submit">{investment && investment.amount && parseInt(investment.amount) > 0 ? "Update" : "Submit"}</button>
                </Form>
                {(this.state.submited && submitedForm) ?
                    <p>
                        Please stay tuned for an invitation to complete the KYC process. <br />
                        As soon as it is completed and approved, you will be able to purchase VAIR tokens:
                    </p>
                    :
                    <p>
                        After your interest commitment has been received you will be invited to complete the KYC process.<br />
                        As soon as it is completed and approved, you will be able to purchase VAIR tokens:
                    </p>
                }
                <div className={style.buttonWrap}>
                    <NavLink
                        className={style.disabledButton}
                        to='/dashboard/verify'
                    >
                        Complete KYC
                    </NavLink>
                    <NavLink
                        className={style.disabledButton}
                        to='/dashboard'
                    >
                        Purchase VAIR
                    </NavLink>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({info, main}) => ({
    investment: info.investment,
    initialValues: info.investment,
    submitedForm: main.submitedForm
});

export default connect(mapStateToProps)(
    reduxForm({
        form: 'investmentsPlan',
        touchOnChange: true,
        enableReinitialize: true
    })(Investments)
);

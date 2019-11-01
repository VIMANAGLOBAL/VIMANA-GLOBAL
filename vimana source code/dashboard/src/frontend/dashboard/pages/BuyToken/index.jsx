import React, { Component } from 'react';
import style from './style.scss';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';

import { reduxForm, Form } from 'redux-form';

class BuyToken extends Component {
    state = {
        currentStep: 1
    };

    handleNextStep = () =>
        this.setState((prevState) => ({ currentStep: prevState.currentStep + 1 }));

    handleStepRender = () => {
        const { currentStep } = this.state;
        switch (currentStep) {
            case 1:
                return <Step1 nextStep={this.handleNextStep} />;
            case 2:
                return <Step2 nextStep={this.handleNextStep} />;
            case 3:
                return <Step3 nextStep={this.handleNextStep} />;
            case 4:
                return <Step4 nextStep={this.handleNextStep} />;
            case 5:
                return <Step5 />;
            default:
        }
    };

    render() {
        return (
            <div className={style.wrapper}>
                <h4>Cooming Soon !</h4>
                {/* <Form>{this.handleStepRender()}</Form> */}
            </div>
        );
    }
}

export default reduxForm({ form: 'Tokens' })(BuyToken);

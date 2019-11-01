import React, { Component } from 'react';
import style from './style.scss';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import Step7 from './Step7';

import { acceptTerms } from '../../ducks/info';

class Terms extends Component {
    state = {
        currentStep: 1
    };

    handleNextStep = () => {
        const { currentStep } = this.state;

        if (currentStep < 7) {
            this.setState({ currentStep: currentStep + 1 });
            return;
        }
        if (currentStep === 7) {
            this.props.dispatch(acceptTerms());
        }
    };

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
                return <Step5 nextStep={this.handleNextStep} />;
            case 6:
                return <Step6 nextStep={this.handleNextStep} />;
            case 7:
                return <Step7 nextStep={this.handleNextStep} />;
            default:
        }
    };

    render() {
        const { currentStep } = this.state;
        return (
            <div className={style.wrapper}>
                <div className={style.wrapper_inner}>
                    <span className={style.step_counter}>0{currentStep} / 07</span>
                    <a href="#">
                        Legal Terms & Conditions Documents <br /> <span>1450 Kb, PDF</span>
                    </a>
                </div>
                {this.handleStepRender()}
                <button onClick={this.handleNextStep} type="button">
                    {currentStep === 7 ? 'Finish' : 'Confirm'}
                </button>
            </div>
        );
    }
}

export default Terms;

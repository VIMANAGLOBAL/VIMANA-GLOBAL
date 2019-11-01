import React from 'react';
import style from './style.scss';

import Button from '../../../../common/components/StepButton';

const Step4 = ({ nextStep }) => (
    <div>
        <span>4</span>
        <Button click={nextStep} value="Next" />
    </div>
    );

export default Step4;

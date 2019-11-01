import React from 'react';
import style from './style.scss';

import Button from '../../../../common/components/StepButton';

const Step5 = ({ nextStep }) => (
    <div>
        <span>5</span>
        <Button click={nextStep} value="Next" />
    </div>
    );

export default Step5;

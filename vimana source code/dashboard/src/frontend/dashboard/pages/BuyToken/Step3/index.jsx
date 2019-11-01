import React from 'react';
import style from './style.scss';

import Button from '../../../../common/components/StepButton';
import TextInput from '../../../../common/components/TextInput';
import { Field } from 'redux-form';

const Step3 = ({ nextStep }) => (
    <div>
        <span>3</span>
        <Field name="Step3" component={TextInput} type="text" label="Step3" />
        <Button click={nextStep} value="Next" />
    </div>
    );

export default Step3;

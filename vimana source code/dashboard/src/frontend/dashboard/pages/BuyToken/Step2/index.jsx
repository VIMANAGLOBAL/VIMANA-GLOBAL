import React from 'react';
import style from './style.scss';

import Button from '../../../../common/components/StepButton';
import TextInput from '../../../../common/components/TextInput';
import { Field } from 'redux-form';

const Step2 = ({ nextStep }) => (
    <div>
        <span>2</span>
        <Field name="Step2" component={TextInput} type="text" label="Step2" />
        <Button click={nextStep} value="Next" />
    </div>
    );

export default Step2;

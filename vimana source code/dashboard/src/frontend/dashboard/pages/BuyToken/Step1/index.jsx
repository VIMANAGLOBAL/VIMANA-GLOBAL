import React from 'react';
import style from './style.scss';

import Button from '../../../../common/components/StepButton';
import TextInput from '../../../../common/components/TextInput';
import SelectInput from '../../../../common/components/SelectInput';

import { Field } from 'redux-form';

const Step1 = ({ nextStep }) => {
    const optionsToRender = [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }];
    return (
        <div>
            <span>1</span>
            <Field name="Select" component={SelectInput} optionsToRender={optionsToRender} />
            <Field name="Step1" component={TextInput} type="text" label="Step1" />
            <Button click={nextStep} value="Next" />
        </div>
    );
};

export default Step1;

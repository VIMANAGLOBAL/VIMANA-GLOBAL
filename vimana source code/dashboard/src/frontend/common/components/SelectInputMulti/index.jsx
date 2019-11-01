import React from 'react';
import style from '../SelectInput/style.scss';

import Select from 'react-select';

const SelectInput = ({
    input,
    optionsToRender,
    placeholder,
    label,
    customClass,
    meta,
    multi = false
}) => {
    const arrowRenderer = () => '▲';

    return (
        <div className={`${style.wrapper} ${meta.error && meta.touched && 'error' || ''}`}>
            <label>{label}</label>
            <Select
                value={input.value[0]}
                onChange={(val) => input.onChange([val])}
                onBlur={() => input.onBlur(input.value)}
                options={optionsToRender}
                placeholder={placeholder}
                className={customClass}
                simpleValue
                searchable={false}
                clearable={false}
                arrowRenderer={arrowRenderer}
                optionClassName={style.option}
                multi={multi}
            />
        </div>
    );
};

export default SelectInput;

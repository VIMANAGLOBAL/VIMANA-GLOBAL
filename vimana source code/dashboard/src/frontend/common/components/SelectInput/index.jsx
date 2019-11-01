import React from 'react';
import style from './style.scss';

import Select from 'react-select';

const SelectInput = ({
    input,
    optionsToRender,
    placeholder,
    label,
    customWrapperClass,
    customClass,
    meta,
    isSearchable = false,
}) => {
    const arrowRenderer = () => '▲';

    return (
        <div className={`${customWrapperClass || style.wrapper} ${meta.error && meta.touched && 'error' || ''}`}>
            {label &&
                <label>{label}</label>
            }
            <Select
                value={input.value}
                onChange={(val) => input.onChange(val)}
                onBlur={() => input.onBlur(input.value)}
                options={optionsToRender}
                placeholder={placeholder}
                className={customClass}
                simpleValue
                searchable={isSearchable}
                clearable={false}
                arrowRenderer={arrowRenderer}
                optionClassName={style.option}
            />
        </div>
    );
};

export default SelectInput;

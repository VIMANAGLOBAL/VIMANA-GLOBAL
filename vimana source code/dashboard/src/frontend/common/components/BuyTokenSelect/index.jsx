import React from 'react';
import style from './style.scss';

import Select from 'react-select';

const BuyTokenSelect = ({ input, optionsToRender, placeholder, customClass }) => {
    const arrowRenderer = () => '▲';

    return (
        <div className={style.wrapper}>
            <Select
                value={input.value}
                onChange={input.onChange}
                onBlur={() => input.onBlur(input.value)}
                options={optionsToRender}
                placeholder={placeholder}
                className={customClass}
                simpleValue
                searchable={false}
                clearable={false}
                arrowRenderer={arrowRenderer}
                optionClassName={style.option}
            />
        </div>
    );
};

export default BuyTokenSelect;

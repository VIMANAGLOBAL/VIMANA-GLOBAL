import React from 'react';
import PropTypes from 'prop-types';
import style from './Input.scss';

import { TextField } from '@material-ui/core';

export class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.value === 'string' && nextProps.value !== this.state.value) {
            this.setState({
                value: nextProps.value
            });
        }
    }

    render() {
        const type = this.props.type || 'text';
        const disabled = typeof this.props.disabled === 'boolean' ? this.props.disabled : false;
        const { value } = this.state;

        return (
            <div className={style.admin_panel__input}>
                <TextField
                    label={this.props.label || ''}
                    disabled={disabled}
                    type={type}
                    value={value}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyPress}
                    classes={{ root: style.input }}
                    fullWidth
                />
            </div>
        );
    }

    onChange = (e) => {
        if (this.props.onChange) {
            const value = e.target.value;

            this.props.onChange(value);

            this.setState({
                value
            });
        }
    };

    onKeyPress = (e) => {
        if (this.props.onKeyPress) {
            this.props.onKeyPress(e);
        }
    };
}

Input.propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onKeyPress: PropTypes.func,
};

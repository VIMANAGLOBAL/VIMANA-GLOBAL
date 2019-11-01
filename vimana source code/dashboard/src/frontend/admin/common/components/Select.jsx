import React from "react";
import PropTypes from "prop-types";
import style from "./Select.scss";
import {Select as MaterialSelect, MenuItem} from "@material-ui/core";

export class Select extends React.Component {
    render() {
        return (
            <div className={style.admin_panel__select}>
                <MaterialSelect
                    value={this.props.value}
                    onChange={this.onChange}
                >
                    {this.props.items.map(i => <MenuItem key={i.name} value={i.value}>{i.name}</MenuItem>)}
                </MaterialSelect>
            </div>
        )
    }

    onChange = e => {
        this.props.onChange(e.target.value);
    }
}

Select.propTypes = {
    value: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
};
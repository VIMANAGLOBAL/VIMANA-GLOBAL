import React from "react";
import PropTypes from "prop-types";
import style from "./Button.scss";

import {Button as MaterialButton} from "@material-ui/core";

export class Button extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const label = this.props.label || "";
        const disabled = typeof this.props.disabled === "boolean" ? this.props.disabled : false;

        return (
            <div className={style.admin_panel__button}>
                <MaterialButton
                    color={"secondary"}
                    variant={"outlined"}
                    disabled={disabled}
                    onClick={this.onClick}
                >
                    {label}
                </MaterialButton>
            </div>
        )
    }

    onClick = e => {
        if (this.props.onClick) {
            this.props.onClick();
        }
    };
}

Button.propTypes = {
    label: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};
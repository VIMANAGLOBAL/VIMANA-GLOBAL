import React from "react";
import PropTypes from "prop-types";
import style from "./Alert.scss";

export class Alert extends React.Component {
    render() {
        const {
            text,
            visible,
        } = this.props;

        return (
            <div className={style.admin__alert}>
                {visible &&
                    <span>
                        {text || ""}
                    </span>
                }
            </div>
        )
    }
}

Alert.propTypes = {
    visible: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
};
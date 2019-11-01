import React from "react";
import PropTypes from "prop-types";

export class UserPanel extends React.Component {
    render() {
        return (
            <div>
                User panel here
            </div>
        )
    }
}

UserPanel.propTypes = {
    failed: PropTypes.bool.isRequired,
    errorCode: PropTypes.string.isRequired,
};

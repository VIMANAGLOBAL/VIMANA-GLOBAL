import React from "react";
import PropTypes from "prop-types";

export class ImportPanel extends React.Component {
    render() {
        return (
            <div>
                Import panel here
            </div>
        )
    }
}

ImportPanel.propTypes = {
    failed: PropTypes.bool.isRequired,
    errorCode: PropTypes.string.isRequired,
};
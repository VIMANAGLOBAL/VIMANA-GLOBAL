import React from "react";
import PropTypes from "prop-types";
import style from "./Header.scss";

import {Button} from "../../common/components/Button";

export class Header extends React.Component {
    render() {
        return (
            <div className={style.admin_panel__header}>
                <Button
                    label={"Log out"}
                    onClick={this.props.onLogout}
                />
            </div>
        )
    }
}

Header.propTypes = {
    onLogout: PropTypes.func.isRequired,
};

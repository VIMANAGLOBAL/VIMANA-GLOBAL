import React from "react";
import PropTypes from "prop-types";
import style from "./LogFilter.scss";
import {Select} from "../../common/components/Select";
import {Input} from "../../common/components/Input";
import {Button} from "../../common/components/Button";

const levelItems = [
    {
        value: "INFO",
        name: "INFO",
    },
    {
        value: "WARN",
        name: "WARN",
    },
    {
        value: "ERROR",
        name: "ERROR",
    },
    {
        value: "ALL",
        name: "ALL"
    }
];

export class LogFilter extends React.Component {
    render() {
        const {
            level,
            reqId,
            text,

            onChangeReqIdFilter,
            onChangeLogLevelFilter,
            onChangeTextFilter,
            onClickApply,
        } = this.props;

        return (
            <div className={style.admin_panel__log_filter}>
                <div className={style.admin_panel__log_filter__block}>
                    {"Log level"}
                    <Select
                        value={level}
                        items={levelItems}
                        onChange={onChangeLogLevelFilter}
                    />
                </div>

                <div className={style.admin_panel__log_filter__block}>
                    {"Request ID"}
                    <Input
                        value={reqId}
                        onChange={onChangeReqIdFilter}
                    />
                </div>

                <div className={style.admin_panel__log_filter__block}>
                    {"Free text"}
                    <Input
                        value={text}
                        onChange={onChangeTextFilter}
                    />
                </div>

                <Button onClick={onClickApply} label={"Apply"}/>
            </div>
        )
    }
}

LogFilter.propTypes = {
    level: PropTypes.string.isRequired,
    reqId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,

    onClickApply: PropTypes.func.isRequired,
    onChangeReqIdFilter: PropTypes.func.isRequired,
    onChangeLogLevelFilter: PropTypes.func.isRequired,
    onChangeTextFilter: PropTypes.func.isRequired,
};
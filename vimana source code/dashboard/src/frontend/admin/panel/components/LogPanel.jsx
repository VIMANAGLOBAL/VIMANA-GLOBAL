import React from "react";
import PropTypes from "prop-types";
import style from "./LogPanel.scss";

import {List, ListItem} from "@material-ui/core";
import {LogListItem} from "./LogListItem";
import {Button} from "../../common/components/Button";
import {LogFilter} from "./LogFilter";

export class LogPanel extends React.Component {
    componentDidMount() {
        this.props.onFetchFiles();
    }

    render() {
        const {
            current,
        } = this.props;

        return (
            <div className={style.admin_panel__log_panel}>
                <div className={style.admin_panel__log_panel__file_list}>
                    <List>
                        {this.props.files.map(i => (
                            <ListItem
                                button
                                key={i}
                                className={style.admin_panel__log_panel__list_item}
                                onClick={() => this.props.onFetchContent(i, 0)}
                            >
                                <span className={current === i ? style.admin_panel__log_panel__selected : ""}>
                                    {i}
                                </span>
                            </ListItem>
                        ))}
                    </List>
                </div>
                <div className={style.admin_panel__log_panel__textbox}>
                    <div className={style.admin_panel__log_panel__textbox_nav}>
                        <Button onClick={this.onClickPrev} label={"<="}/>
                        <Button onClick={this.onClickNext} label={"=>"}/>
                    </div>
                    {this.props.content && this.props.content.map((i, j) => (
                        <LogListItem
                            key={j}
                            text={i}
                        />
                    ))}
                    <div className={style.admin_panel__log_panel__textbox_nav}>
                        <Button onClick={this.onClickPrev} label={"<="}/>
                        <Button onClick={this.onClickNext} label={"=>"}/>
                    </div>
                </div>
                <div className={style.admin_panel__log_panel__filters}>
                    <LogFilter
                        level={this.props.filter.level}
                        reqId={this.props.filter.reqId}
                        text={this.props.filter.text}

                        onClickApply={this.onClickApply}
                        onChangeReqIdFilter={this.props.onChangeReqIdFilter}
                        onChangeLogLevelFilter={this.props.onChangeLogLevelFilter}
                        onChangeTextFilter={this.props.onChangeTextFilter}
                    />
                </div>
            </div>
        )
    }

    onClickApply = () => {
        const filter = this.props.filter;

        this.props.onFetchContent(this.props.current, this.props.part, filter);
    };

    onClickPrev = () => {
        const filter = this.props.filter;

        this.props.onFetchContent(this.props.current, this.props.part - 1, filter);
    };

    onClickNext = () => {
        const filter = this.props.filter;

        this.props.onFetchContent(this.props.current, this.props.part + 1, filter);
    }
}

LogPanel.propTypes = {
    failed: PropTypes.bool.isRequired,
    errorCode: PropTypes.string.isRequired,

    current: PropTypes.string.isRequired,
    content: PropTypes.array.isRequired,
    part: PropTypes.number.isRequired,
    files: PropTypes.array.isRequired,

    filter: PropTypes.object.isRequired,

    onFetchContent: PropTypes.func.isRequired,
    onFetchFiles: PropTypes.func.isRequired,

    onChangeReqIdFilter: PropTypes.func.isRequired,
    onChangeTextFilter: PropTypes.func.isRequired,
    onChangeLogLevelFilter: PropTypes.func.isRequired,
};

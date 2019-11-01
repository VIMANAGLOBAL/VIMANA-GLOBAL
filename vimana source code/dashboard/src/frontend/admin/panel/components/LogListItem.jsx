import React from "react";
import PropTypes from "prop-types";
import Text from "react-format-text";
import style from "./LogListItem.scss";
import {Button, Paper} from "@material-ui/core";
import parseJson from 'parse-json';

export class LogListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
    }

    parse = obj => {
        for (const key in obj) {
            if (typeof obj[key] === "string" && obj[key][0] === "{") {
                obj[key] = this.parse(parseJson(obj[key]));
            } else if (typeof obj[key] === "object") {
                obj[key] = this.parse(obj[key]);
            }
        }

        return obj;
    };

    render() {
        const {isOpen} = this.state;
        const {text} = this.props;

        let textObj = text && text.length && text.trim().length ? parseJson(text) : {};
        textObj = this.parse(textObj);

        return (
            text && text.trim && text.trim().length ?
                <div className={style.admin_panel__log_list_item__main}>
                    <Button
                        mini
                        variant={"fab"}
                        onClick={this.onClick}
                    >
                        {isOpen ? "-" : "+"}
                    </Button>
                    <Paper className={style.admin_panel__log_list_item__paper}>
                        {isOpen ?
                            <Text>
                                {JSON.stringify(textObj, null, "░░░")}
                            </Text>
                            :
                            text
                        }
                    </Paper>
                </div> : null
        )
    }

    onClick = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }
}

LogListItem.propTypes = {
    text: PropTypes.string.isRequired,
};
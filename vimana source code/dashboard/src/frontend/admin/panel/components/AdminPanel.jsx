import React from 'react';
import PropTypes from 'prop-types';
import style from './AdminPanel.scss';

import { Tab, Tabs } from '@material-ui/core';

import { Header } from './Header';
import { ImportPanel } from './ImportPanel';
import { LogPanel } from './LogPanel';
import { UserPanel } from './UserPanel';
import { LinkPanel } from './LinkPanel';

const LINK_TAB = 0;
const LOGS_TAB = 1;

export class AdminPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: LINK_TAB
        };
    }

    onTabChange = (e, value) => {
        this.setState({
            currentTab: value
        });
    };

    render() {
        const {
            logPanel,
            linkPanel,

            onFetchFiles,
            onFetchContent,

            onChangeReqIdFilter,
            onChangeLogLevelFilter,
            onChangeTextFilter,
            onChangeLinkContactName,
            onChangeLinkContactPhone,
            onChangeLinkContactMail,
            onChangeLinkName,
            onChangeLinkTitle,

            onChangeEmailLink,
            onCreateLink,
            onSend
        } = this.props;

        return (
            <div className={style.wrapper}>
                <Header onLogout={this.props.onLogout} />
                <div>
                    <Tabs centered value={this.state.currentTab} onChange={this.onTabChange}>
                        <Tab label="Link creation" />
                        <Tab label="Logs" />
                    </Tabs>
                </div>
                <div>
                    {this.state.currentTab === LINK_TAB && (
                        <LinkPanel
                            failed={linkPanel.failed}
                            errorCode={linkPanel.errorCode}
                            successSend={linkPanel.successSend}
                            link={linkPanel.link}
                            name={linkPanel.name}
                            email={linkPanel.email}
                            contactMail={linkPanel.contactMail}
                            contactName={linkPanel.contactName}
                            contactPhone={linkPanel.contactPhone}
                            title={linkPanel.title}
                            onSend={onSend}
                            onCreateLink={onCreateLink}
                            onChangeLinkName={onChangeLinkName}
                            onChangeEmailLink={onChangeEmailLink}
                            onChangeLinkContactMail={onChangeLinkContactMail}
                            onChangeLinkContactName={onChangeLinkContactName}
                            onChangeLinkContactPhone={onChangeLinkContactPhone}
                            onChangeLinkTitle={onChangeLinkTitle}
                        />
                    )}

                    {this.state.currentTab === LOGS_TAB && (
                        <LogPanel
                            failed={false}
                            errorCode=""
                            part={logPanel.part}
                            current={logPanel.current}
                            content={logPanel.content}
                            files={logPanel.files}
                            filter={logPanel.filter}
                            onChangeLogLevelFilter={onChangeLogLevelFilter}
                            onChangeReqIdFilter={onChangeReqIdFilter}
                            onChangeTextFilter={onChangeTextFilter}
                            onFetchContent={onFetchContent}
                            onFetchFiles={onFetchFiles}
                        />
                    )}
                </div>
            </div>
        );
    }
}

AdminPanel.propTypes = {
    failed: PropTypes.bool.isRequired,
    errorCode: PropTypes.string.isRequired,

    logPanel: PropTypes.object.isRequired,
    linkPanel: PropTypes.object.isRequired,

    onFetchContent: PropTypes.func.isRequired,
    onFetchFiles: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onSend: PropTypes.func.isRequired,

    onChangeReqIdFilter: PropTypes.func.isRequired,
    onChangeLogLevelFilter: PropTypes.func.isRequired,
    onChangeTextFilter: PropTypes.func.isRequired,

    onChangeLinkContactName: PropTypes.func.isRequired,
    onChangeLinkContactPhone: PropTypes.func.isRequired,
    onChangeLinkContactMail: PropTypes.func.isRequired,
    onChangeLinkName: PropTypes.func.isRequired,

    onChangeEmailLink: PropTypes.func.isRequired,
    onCreateLink: PropTypes.func.isRequired
};

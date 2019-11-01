import React from 'react';

import { connect } from 'react-redux';

import {
    logout,
    fetchFiles,
    fetchContent,
    changeTextFilter,
    changeReqIdFilter,
    changeLogLevelFilter,
    changeLinkEmail,
    createLink,
    changeLinkContactMail,
    changeLinkContactPhone,
    changeLinkName,
    changeLinkTitle,
    changeLinkContactName,
    send
} from '../actions';
import { AdminPanel } from '../components/AdminPanel';

class Main extends React.Component {
    render() {
        const {
            failed,
            errorCode,
            logPanel,
            linkPanel,

            send,
            logout,
            fetchFiles,
            fetchContent,
            changeLogLevelFilter,
            changeReqIdFilter,
            changeTextFilter,
            changeLinkEmail,
            createLink,
            changeLinkContactName,
            changeLinkContactPhone,
            changeLinkContactMail,
            changeLinkName,
            changeLinkTitle
        } = this.props;

        return (
            <AdminPanel
                failed={failed}
                errorCode={errorCode}
                logPanel={logPanel}
                linkPanel={linkPanel}
                onChangeReqIdFilter={changeReqIdFilter}
                onChangeLogLevelFilter={changeLogLevelFilter}
                onChangeTextFilter={changeTextFilter}
                onChangeEmailLink={changeLinkEmail}
                onChangeLinkTitle={changeLinkTitle}
                onCreateLink={createLink}
                onFetchContent={fetchContent}
                onFetchFiles={fetchFiles}
                onSend={send}
                onLogout={logout}
                onChangeLinkContactName={changeLinkContactName}
                onChangeLinkContactMail={changeLinkContactMail}
                onChangeLinkContactPhone={changeLinkContactPhone}
                onChangeLinkName={changeLinkName}
            />
        );
    }
}

const mapState2props = (state) => ({
    failed: state.failed,
    errorCode: state.errorCode,

    logPanel: state.logPanel,
    linkPanel: state.linkPanel
});

const mapDispatch2props = {
    send,
    logout,
    fetchFiles,
    createLink,
    fetchContent,
    changeLinkName,
    changeLinkEmail,
    changeTextFilter,
    changeReqIdFilter,
    changeLogLevelFilter,
    changeLinkContactName,
    changeLinkContactMail,
    changeLinkContactPhone,
    changeLinkTitle
};

export default connect(
    mapState2props,
    mapDispatch2props
)(Main);

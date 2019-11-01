import React from 'react';
import PropTypes from 'prop-types';
import copy from 'clipboard-copy';

import style from './LinkPanel.scss';

import { Input } from '../../common/components/Input';
import { Button } from '../../common/components/Button';

export class LinkPanel extends React.Component {
    handleErrorCode = (errorCode) => {
        switch (errorCode) {
            case 'EMAIL_NOT_UNIQUE':
                return 'Email is already in use';
            case 'EMAIL_NOT_VALID':
                return "Email isn't valid";
            default:
                return 'Some error occurred';
        }
    };

    handleLinkClick = () => {
        copy(this.props.link);
    };

    render() {
        const {
            failed,
            errorCode,
            successSend,

            email,
            link,
            name,
            contactName,
            contactMail,
            contactPhone,
            title,

            onChangeLinkContactName,
            onChangeLinkContactPhone,
            onChangeLinkContactMail,
            onChangeLinkName,
            onChangeEmailLink,
            onChangeLinkTitle,
            onCreateLink,
            onSend
        } = this.props;

        return (
            <div className={style.wrapper}>
                {failed && <div className={style.alert}>{this.handleErrorCode(errorCode)}</div>}
                {successSend && <div className={style.success}>Letter successfully sent</div>}
                <Input value={email} label="Enter an email" onChange={onChangeEmailLink} />
                <div className={style.inner_wrapper}>
                    <Input value={title} label="Enter a title" onChange={onChangeLinkTitle} />
                    <Input value={name} label={"Enter a user's name"} onChange={onChangeLinkName} />
                </div>
                <Input
                    value={contactPhone}
                    label="Enter contact phone"
                    onChange={onChangeLinkContactPhone}
                />
                <Input
                    value={contactMail}
                    label="Enter contact email"
                    onChange={onChangeLinkContactMail}
                />
                <Input
                    value={contactName}
                    label="Enter contact name"
                    onChange={onChangeLinkContactName}
                />
                {link && (
                    <div className={style.link} onClick={this.handleLinkClick}>
                        Link: <span>{link}</span>
                    </div>
                )}
                <Button
                    label="Create link"
                    onClick={() =>
                        onCreateLink(email, name, contactPhone, contactMail, contactName, title)
                    }
                />
                <Button
                    label="Send"
                    disabled={!link}
                    onClick={() =>
                        onSend(email, link, name, contactPhone, contactMail, contactName, title)
                    }
                />
            </div>
        );
    }
}

LinkPanel.propTypes = {
    failed: PropTypes.bool.isRequired,
    errorCode: PropTypes.string.isRequired,
    successSend: PropTypes.bool.isRequired,

    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    contactName: PropTypes.string.isRequired,
    contactMail: PropTypes.string.isRequired,
    contactPhone: PropTypes.string.isRequired,

    link: PropTypes.string.isRequired,

    onChangeEmailLink: PropTypes.func.isRequired,
    onChangeLinkContactName: PropTypes.func.isRequired,
    onChangeLinkContactPhone: PropTypes.func.isRequired,
    onChangeLinkContactMail: PropTypes.func.isRequired,
    onChangeLinkName: PropTypes.func.isRequired,

    onCreateLink: PropTypes.func.isRequired,
    onSend: PropTypes.func.isRequired
};

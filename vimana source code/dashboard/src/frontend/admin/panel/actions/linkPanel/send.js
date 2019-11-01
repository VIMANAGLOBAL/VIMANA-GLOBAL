import { getFetchInitProps } from '../../../common/util/request';
import { SEND_FAILED, SEND_SEND, SEND_SUCCESS } from '../../constants/ActionType';

const sendSend = (email, link, name, contactName, contactPhone, contactMail) => ({
    type: SEND_SEND,
    email,
    name,
    contactName,
    contactMail,
    contactPhone
});

const sendSuccess = () => ({
    type: SEND_SUCCESS
});

const sendFailed = (errorCode) => ({
    type: SEND_FAILED,
    errorCode
});

export const send = (email, link, name, contactPhone, contactMail, contactName, title) => (
    dispatch
) => {
    const url = '/api/admin/send-welcome-letter';

    dispatch(sendSend(email, link, name, contactName, contactPhone, contactMail, title));

    fetch(
        url,
        getFetchInitProps(
            'POST',
            JSON.stringify({
                email,
                link,
                name,
                contactName,
                contactPhone,
                contactMail,
                prefix: title
            })
        )
    )
        .then((res) => res.json())
        .then((res) => {
            if (res && res.success) {
                dispatch(sendSuccess(res.payload));
            } else {
                throw new Error(res.errorCode);
            }
        })
        .catch((err) => {
            if (err.message === 'AUTH_ERROR') {
                document.location.href = '/admin/signin';
            }
            dispatch(sendFailed(err.message));
        });
};

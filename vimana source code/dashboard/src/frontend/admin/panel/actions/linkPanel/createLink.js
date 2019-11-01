import {
    CREATE_LINK_FAILED,
    CREATE_LINK_SEND,
    CREATE_LINK_SUCCESS
} from '../../constants/ActionType';
import { getFetchInitProps } from '../../../common/util/request';

const createLinkSend = (email, name, contactName, contactPhone, contactMail, title) => ({
    type: CREATE_LINK_SEND,
    email,
    name,
    contactName,
    contactMail,
    contactPhone,
    title
});

const createLinkSuccess = (link) => ({
    type: CREATE_LINK_SUCCESS,
    payload: link
});

const createLinkFailed = (errorCode) => ({
    type: CREATE_LINK_FAILED,
    errorCode
});

export const createLink = (email, name, contactPhone, contactMail, contactName, title) => (
    dispatch
) => {
    const url = '/api/admin/create-link';

    dispatch(createLinkSend(email, name, contactName, contactPhone, contactMail, title));

    fetch(
        url,
        getFetchInitProps(
            'POST',
            JSON.stringify({ email, name, contactName, contactPhone, contactMail, prefix: title })
        )
    )
        .then((res) => res.json())
        .then((res) => {
            if (res && res.success) {
                dispatch(createLinkSuccess(res.payload));
            } else {
                throw new Error(res.errorCode);
            }
        })
        .catch((err) => {
            if (err.message === 'AUTH_ERROR') {
                document.location.href = '/admin/signin';
            }
            dispatch(createLinkFailed(err.message));
        });
};

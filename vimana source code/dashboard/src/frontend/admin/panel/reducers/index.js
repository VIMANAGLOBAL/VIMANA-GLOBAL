import {
    LOGOUT_FAILED,
    LOGOUT_SUCCESS,
    LOGOUT_SEND,
    FETCH_CONTENT_FAILED,
    FETCH_CONTENT_SUCCESS,
    FETCH_CONTENT_SEND,
    FETCH_FILES_SUCCESS,
    FETCH_FILES_SEND,
    FETCH_FILES_FAILED,
    CHANGE_LOG_LEVEL_FILTER,
    CHANGE_REQ_ID_FILTER,
    CHANGE_TEXT_FILTER,
    CHANGE_LINK_EMAIL,
    CREATE_LINK_FAILED,
    CREATE_LINK_SUCCESS,
    CREATE_LINK_SEND,
    CHANGE_LINK_CONTACT_MAIL,
    CHANGE_LINK_CONTACT_NAME,
    CHANGE_LINK_CONTACT_PHONE,
    CHANGE_LINK_TITLE,
    CHANGE_LINK_NAME,
    SEND_FAILED,
    SEND_SUCCESS,
    SEND_SEND
} from '../constants/ActionType';
import { changeTextFilterReducer } from './logPanel/changeTextFilter';
import { changeReqIdFilterReducer } from './logPanel/changeReqIdFilter';
import { changeLogLevelFilterReducer } from './logPanel/changeLogLevelFilter';
import { logoutFailedReducer, logoutSendReducer, logoutSuccessReducer } from './logout';
import {
    fetchContentSendReducer,
    fetchContentSuccessReducer,
    fetchContentFailedReducer
} from './logPanel/fetchContent';
import { sendFailedReducer, sendSendReducer, sendSuccessReducer } from './linkPanel/send';
import {
    fetchFilesFailedReducer,
    fetchFilesSendReducer,
    fetchFilesSuccessReducer
} from './logPanel/fetchFiles';
import { changeLinkContactMailReducer } from './linkPanel/changeLinkContactMail';
import { changeLinkContactNameReducer } from './linkPanel/changeLinkContactName';
import { changeLinkContactPhoneReducer } from './linkPanel/changeLinkContactPhone';
import { changeLinkNameReducer } from './linkPanel/changeLinkName';
import { changeLinkEmailReducer } from './linkPanel/changeLinkEmail';
import { changeLinkTitleReducer } from './linkPanel/changeLinkTitle';
import {
    createLinkFailedReducer,
    createLinkSendReducer,
    createLinkSuccessReducer
} from './linkPanel/createLink';

export default function(state, action) {
    switch (action.type) {
        case SEND_SEND:
            return sendSendReducer(state);
        case SEND_SUCCESS:
            return sendSuccessReducer(state);
        case SEND_FAILED:
            return sendFailedReducer(state, action);

        case CHANGE_LINK_EMAIL:
            return changeLinkEmailReducer(state, action);
        case CHANGE_LINK_TITLE:
            return changeLinkTitleReducer(state, action);
        case CHANGE_LINK_NAME:
            return changeLinkNameReducer(state, action);
        case CHANGE_LINK_CONTACT_PHONE:
            return changeLinkContactPhoneReducer(state, action);
        case CHANGE_LINK_CONTACT_NAME:
            return changeLinkContactNameReducer(state, action);
        case CHANGE_LINK_CONTACT_MAIL:
            return changeLinkContactMailReducer(state, action);

        case CREATE_LINK_SEND:
            return createLinkSendReducer(state);
        case CREATE_LINK_SUCCESS:
            return createLinkSuccessReducer(state, action);
        case CREATE_LINK_FAILED:
            return createLinkFailedReducer(state, action);

        case CHANGE_LOG_LEVEL_FILTER:
            return changeLogLevelFilterReducer(state, action);
        case CHANGE_REQ_ID_FILTER:
            return changeReqIdFilterReducer(state, action);
        case CHANGE_TEXT_FILTER:
            return changeTextFilterReducer(state, action);

        case LOGOUT_SEND:
            return logoutSendReducer(state);
        case LOGOUT_SUCCESS:
            return logoutSuccessReducer(state);
        case LOGOUT_FAILED:
            return logoutFailedReducer(state, action);

        case FETCH_FILES_SEND:
            return fetchFilesSendReducer(state);
        case FETCH_FILES_SUCCESS:
            return fetchFilesSuccessReducer(state, action);
        case FETCH_FILES_FAILED:
            return fetchFilesFailedReducer(state, action);

        case FETCH_CONTENT_SEND:
            return fetchContentSendReducer(state, action);
        case FETCH_CONTENT_SUCCESS:
            return fetchContentSuccessReducer(state, action);
        case FETCH_CONTENT_FAILED:
            return fetchContentFailedReducer(state, action);

        default:
            return state;
    }
}

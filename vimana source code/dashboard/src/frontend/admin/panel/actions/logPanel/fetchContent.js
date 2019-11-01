import {FETCH_CONTENT_FAILED, FETCH_CONTENT_SEND, FETCH_CONTENT_SUCCESS} from "../../constants/ActionType";
import {getFetchInitProps} from "../../../common/util/request";

const fetchContentSend = (current, part, filter) => ({
    type: FETCH_CONTENT_SEND,
    payload: {
        current,
        part,
        filter,
    },
});

const fetchContentSuccess = content => ({
    type: FETCH_CONTENT_SUCCESS,
    payload: content,
});

const fetchContentFailed = errorCode => ({
    type: FETCH_CONTENT_FAILED,
    errorCode,
});

export const fetchContent = (current, part, filter) => dispatch => {
    const url = "/api/admin/fetch-content";

    dispatch(fetchContentSend(current, part));

    fetch(url, getFetchInitProps("POST", JSON.stringify({current, part, filter})))
        .then(res => res.json())
        .then(res => {
            if (res && res.success) {
                dispatch(fetchContentSuccess(res.payload));
            } else {
                throw new Error(res.errorCode);
            }
        })
        .catch((err) => {
            dispatch(fetchContentFailed(err.message));
        });
};
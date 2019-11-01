import {FETCH_FILES_FAILED, FETCH_FILES_SEND, FETCH_FILES_SUCCESS} from "../../constants/ActionType";
import {getFetchInitProps} from "../../../common/util/request";

const fetchFilesSend = () => ({
    type: FETCH_FILES_SEND,
});

const fetchFilesSuccess = files => ({
    type: FETCH_FILES_SUCCESS,
    payload: files,
});

const fetchFilesFailed = errorCode => ({
    type: FETCH_FILES_FAILED,
    errorCode,
});

export const fetchFiles = () => dispatch => {
    const url = "/api/admin/fetch-files";

    dispatch(fetchFilesSend());

    fetch(url, getFetchInitProps("GET"))
        .then(res => res.json())
        .then(res => {
            if (res && res.success) {
                dispatch(fetchFilesSuccess(res.payload));
            } else {
                throw new Error(res.errorCode);
            }
        })
        .catch((err) => {
            dispatch(fetchFilesFailed(err.message));
        });
};
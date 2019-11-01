import {CHANGE_REQ_ID_FILTER} from "../../constants/ActionType";

export const changeReqIdFilter = reqId => ({
    type: CHANGE_REQ_ID_FILTER,
    payload: reqId,
});

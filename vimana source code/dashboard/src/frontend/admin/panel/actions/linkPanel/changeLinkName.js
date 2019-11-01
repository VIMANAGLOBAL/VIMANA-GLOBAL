import {CHANGE_LINK_NAME} from "../../constants/ActionType";

export const changeLinkName = name => ({
    type: CHANGE_LINK_NAME,
    name,
});

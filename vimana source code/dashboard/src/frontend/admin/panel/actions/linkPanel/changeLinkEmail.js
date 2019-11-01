import {CHANGE_LINK_EMAIL} from "../../constants/ActionType";

export const changeLinkEmail = email => ({
    type: CHANGE_LINK_EMAIL,
    email,
});

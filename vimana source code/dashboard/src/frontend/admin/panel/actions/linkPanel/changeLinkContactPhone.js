import {CHANGE_LINK_CONTACT_PHONE} from "../../constants/ActionType";

export const changeLinkContactPhone = contactPhone => ({
    type: CHANGE_LINK_CONTACT_PHONE,
    contactPhone,
});

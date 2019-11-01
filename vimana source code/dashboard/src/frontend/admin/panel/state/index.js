export const initialState = {
    failed: false,
    errorCode: '',

    locked: false,

    linkPanel: {
        failed: false,
        errorCode: '',
        successSend: false,

        name: '',
        email: '',
        contactName: '',
        contactMail: '',
        contactPhone: '',
        title: '',

        link: ''
    },

    logPanel: {
        failed: false,
        errorCode: '',

        current: '',
        content: [],
        part: 0,
        files: [],

        filter: {
            level: 'ALL',
            reqId: '',
            text: ''
        }
    }
};

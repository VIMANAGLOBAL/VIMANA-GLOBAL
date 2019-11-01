export const address = (val) => {
    if (/^[\w\d\s.,\\/\-#№]+$/.test(val)) return val;
    if (!val.length) return val;
};

export const country = (val) => {
    if (/^[\w\s\-]+$/.test(val)) return val;
    if (!val.length) return val;
};

export const countryState = (val) => {
    if (/^[\w\s.,\\/\-]+$/.test(val)) return val;
    if (!val.length) return val;
};

export const city = (val) => {
    if (/^[\w\d\s\-]+$/.test(val)) return val;
    if (!val.length) return val;
};

export const phoneNormalize = (val) => {
    if (/^[\-\d\+\(\)]{0,20}$/.test(val)) return val;
    if (!val.length) return val;
};

export const onlyDigits = (value) => value.replace(/^\D+$/, '');

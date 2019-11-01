import * as libphonenumber from 'libphonenumber-js';
import moment from 'moment';
import { handleFetch } from './fetch';

export const required = (value) => (value ? undefined : 'Required');

export const email = (value) =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+/i.test(value) ? 'Incorrect' : undefined;

export const passwordsMatch = (value, allValues) =>
    value !== allValues.password ? "Passwords don't match" : undefined;

export const passwordsMatchSettings = (value, allValues) =>
    value !== allValues.newPass ? "Passwords don't match" : undefined;

const minValue = (min) => (value) =>
    value && value.length < min ? `Must be at least ${min}` : undefined;

export const phone = (val) => {
    if (val !== undefined && val.length && !libphonenumber.isValidNumber(val || '')) {
        return 'Invalid phone number';
    }
};

export const asyncValidate = (val) =>
    handleFetch('/signup/check-email', 'POST', {
        email: val.email
    }).then((res) => {
        if (!res.success) {
            throw { email: res.errorCode };
        }
    });

export const minValue6 = minValue(6);

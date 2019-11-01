import React from 'react';
import style from './style.scss';

import TextInput from '../../../../common/components/TextInput';

import { Field } from 'redux-form';
import { onlyDigits } from '../../../../common/helpers/normalize';

const Email = () => (
    <React.Fragment>
        <Field
            type="text"
            name="token"
            component={TextInput}
            label={<img src="/api/settings/qr" />}
            normalize={(val) => onlyDigits(val)}
        />
        <div className={style.qr}>
            Scan this QR-code with Google Authenticator app.<br /> You can download it in &nbsp;
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://itunes.apple.com/ru/app/google-authenticator/id388497605?platform=iphone&preserveScrollPosition=true#platform/iphone"
            >
                AppStore
            </a>&nbsp; or in &nbsp;
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
            >
                Google Play
            </a>
        </div>
    </React.Fragment>
);

export default Email;

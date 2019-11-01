import React from 'react';
import style from './style.scss';

import { Link } from 'react-router-dom';

const PrivacyPolicy = () => (
    <div className={style.wrapper}>
        <h3>Vimana Privacy Policy</h3>
        <span>Last amended: 15.08.2018</span>
        <p>
            At Vimana, we are committed to protecting your privacy. Please, read this Privacy Policy
            to become familiar with further details of our approaches towards your personal data.
        </p>
        <p>
            This Privacy Policy is a binding agreement between you and VIMANA Blockchain Airspace AG
            (the “Company”, “Vimana”).
        </p>
        <p>
            <strong>What we need and why?</strong> <br />
            Our Privacy Policy governs the processing of your data, including but not limited to
            collection, use, storage, transfer etc connected with your use of Services, as defined
            in our <Link to="/terms-conditions">Terms of Use.</Link>
        </p>
        <p>
            VIMANA is a Controller of the personal data you provide us with, including your contact
            information, collected and processed in order to provide you with the Services.
        </p>
        <p>
            <strong>What we do with it?</strong> <br />
            Your personal data is processed by the Company. No third party providers have access to
            your data unless specifically required by law.
        </p>

        <p>
            <strong>How long we keep it?</strong>
            <br />
            Under the applicable laws, we are required to keep your personal data during a
            reasonable time. After this period, your personal data will be irreversibly destroyed.
            Any personal data held by us for marketing and service update notifications will be kept
            by us until such time that you notify us that you no longer wish to receive this
            information.
        </p>
        <p>
            <strong>What are your rights?</strong> <br />
            Should you believe that any personal data we hold on you is incorrect or incomplete, you
            have the ability to request to see this information, rectify it or have it deleted.
            Please contact us through &nbsp;
            <a target="_top" href="mailto:privacypolicy@vimana.global">
                privacypolicy@vimana.global.
            </a>
        </p>
        <p>
            In the event that you wish to complain about how we have handled your personal data,
            please contact us via&nbsp;
            <a target="_top" href="mailto:support@vimana.global">
                support@vimana.global.
            </a>
            Afterward, we will look into your complaint and work with you to resolve the matter.
        </p>
        <p>
            If you still feel that your personal data have not been handled appropriately according
            to the law, you can contact the Data Protection Authority, based in your jurisdiction,
            and file a complaint with them.
        </p>
    </div>
);

export default PrivacyPolicy;

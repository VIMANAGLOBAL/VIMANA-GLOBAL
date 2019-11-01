import React from 'react';
import style from './style.scss';

import { Link } from 'react-router-dom';

const CookiePolicy = () => (
    <div className={style.wrapper}>
        <h3>VIMANA COOKIES POLICY</h3>
        <span>Last amended: 15.08.2018</span>
        <p>
            This Cookies Policy is a part of our more general Privacy Policy which can be found
            <Link to="/privacy-policy"> here</Link>. Our Cookies Policy explains what cookies are,
            how we use cookies, your choices regarding cookies and further information about
            cookies.
        </p>
        <p>
            <strong>Does Vimana use cookies? </strong> <br /> Yes. Vimana ("us", "we", or "our")
            uses cookies and other technologies on the &nbsp;
            <a href="https://vimana.global/">vimana.global</a> website and within our related
            services (the "Services"). By using the Services, you consent to the use of cookies for
            the purposes we describe in this policy.
        </p>
        <p>
            <strong>What are cookies and has do they work? </strong> <br />
            Cookies are small files comprising bits of text that are installed on your computer or
            mobile device each time you open a website. These small files enable users to
            authenticate themselves on successive visits to the website and gain access to the
            Services.
        </p>
        <p>
            Your browser tells our systems if any cookies files were installed in your computer and
            after our software systems connect to the cookies we are able to analyze the information
            the cookies files give us.
        </p>
        <p>
            Without the use of an authentication token stored in a cookie you as a user would have
            to provide a username/password on each page request.
        </p>
        <p>
            <strong>What cookies does Vimana use and for what purposes?</strong> <br /> Vimana uses
            the cookies for the following purposes when entering the website:
        </p>
        <table>
            <thead>
                <tr>
                    <th>Categories of Use</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Authentication</td>
                    <td>
                        If you’re signed in to the Services, cookies help us to customize and
                        enhance your experience on our Services. They are necessary to allow you as
                        the user to authenticate yourself on successive visits to the website and
                        gain access to authorized Services.
                    </td>
                </tr>
            </tbody>
        </table>
        <p>
            <strong>
                Can I opt-out from the use of cookies after I agreed Vimana will use it?
            </strong>
            <br />
            No, you may not opt-out from the session cookies used within the Services.
        </p>
        <p>
            <strong>What are your choices regarding cookies</strong> <br /> As a rule, you as a user
            of any other services have a number of choice regarding other types of cookies. If you'd
            like to delete cookies or instruct your web browser to delete or refuse cookies, please
            visit the help pages of your web browser as specified below.
        </p>
        <p>
            For the Chrome web browser, please visit this
            <a href="https://support.google.com/accounts/answer/32050"> page</a> from Google
            <br /> For the Internet Explorer web browser, please visit this
            <a href="http://support.microsoft.com/kb/278835"> page</a> from Microsoft
            <br />
            For the Firefox web browser, please visit this
            <a href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored">
                &nbsp;page&nbsp;
            </a>
            from Mozilla
            <br />
            For the Safari web browser, please visit this
            <a href="https://support.apple.com/kb/PH21411?locale=en_US"> page</a> from Apple
        </p>
        <p>For any other web browser, please visit your web browser's official web pages.</p>
        <p>
            Please note, however, that if you delete cookies or refuse to accept them, you might not
            be able to use all of the features we offer, you may not be able to store your
            preferences, and some of our pages might not display properly, since the Services will
            no longer be personalized to you. It may also stop you from saving customized settings
            like login information.
        </p>
        <p>
            If you use the Services without changing your browser settings, we’ll assume that you’re
            happy to receive all cookies within our Services.
        </p>
        <p>
            <strong>Where can you find more information about cookies?</strong> <br />
            You can learn more about cookies and the following third-party websites: <br />
            AllAboutCookies:
            <a href="http://www.allaboutcookies.org/"> http://www.allaboutcookies.org/</a> <br />
            Network Advertising Initiative:
            <a href="http://www.networkadvertising.org/"> http://www.networkadvertising.org/</a>
        </p>
    </div>
);

export default CookiePolicy;

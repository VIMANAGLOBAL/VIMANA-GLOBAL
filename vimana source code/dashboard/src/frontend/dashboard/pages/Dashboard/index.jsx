import React from 'react';
import style from './style.scss';

// import ProgressBar from './ProgressBar';
// import Info from './Info';
import Investments from './Investments';

import { connect } from 'react-redux';

const Dashboard = ({ date }) => (
    <div className={style.wrapper}>
        {/* <ProgressBar date={date} /> */}
        {/* <Info /> */}
        <Investments />
    </div>
);

const mapStateToProps = ({ main }) => ({
    date: main.crowdsaleDate
});

export default connect(mapStateToProps)(Dashboard);

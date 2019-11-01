import React from 'react';
import style from './style.scss';

import TItem from './TItem';
import InfiniteScroll from 'react-infinite-scroller';

import { getTransactions } from '../../../../ducks/main';

const TBody = ({ data, dispatch, count }) => (
    <InfiniteScroll
        element="tbody"
        pageStart={0}
        initialLoad
        loadMore={(page) => dispatch(getTransactions(page))}
        hasMore={data.length < count}
        loader={(
            <div className="loader" key={0}>
                Loading ...
            </div>
)}
    >
        {data.map((item) => <TItem item={item} key={item.id} />)}
    </InfiniteScroll>
);

export default TBody;

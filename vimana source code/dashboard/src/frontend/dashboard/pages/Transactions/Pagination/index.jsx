import React, { Component } from 'react';
import style from './style.scss';

import PaginationLib from 'react-js-pagination';
import { getTransactions } from '../../../ducks/main';

export default class Pagination extends Component {
    state = {
        currentPage: 1,
        itemsPerPage: 3
    };

    componentDidMount = () => {
        const { currentPage, itemsPerPage } = this.state;
        this.props.dispatch(getTransactions(currentPage, { count: itemsPerPage }));
    };

    handleNextPage = (pageNumbers) => {
        const { itemsPerPage } = this.state;

        this.setState({ currentPage: pageNumbers });
        this.props.dispatch(getTransactions(pageNumbers, { count: itemsPerPage }));
    };

    render() {
        const { count } = this.props;
        const { currentPage, itemsPerPage } = this.state;

        return (
            <PaginationLib
                activePage={currentPage}
                itemsCountPerPage={itemsPerPage}
                totalItemsCount={count}
                pageRangeDisplayed={5}
                onChange={this.handleNextPage}
                innerClass={style.wrapper}
                activeClass={style.active}
                hideNavigation
                hideFirstLastPages
            />
        );
    }
}

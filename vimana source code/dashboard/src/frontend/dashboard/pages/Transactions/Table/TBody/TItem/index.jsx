import React, { Component } from 'react';
import style from './style.scss';

import moment from 'moment';
import Clipboard from 'react-clipboard.js';

class TItem extends Component {
    state = {
        tooltip: {
            show: false,
            id: 0
        }
    };

    handleHideTooltip = (id) => this.setState({ tooltip: { id, show: false } });

    handleShowTooltip = (id) => this.setState({ tooltip: { id, show: true } });

    render() {
        const { item } = this.props;
        const {
            tooltip: { id, show }
        } = this.state;

        return (
            <tr className={style.wrapper}>
                <td className="column1">{item.id}</td>
                <td
                    onMouseEnter={() => this.handleShowTooltip(1)}
                    onMouseLeave={() => this.handleHideTooltip(1)}
                    className="column2"
                >
                    <span className={style.text_overflow}>{item.agent}</span>
                    {id === 1 &&
                        show && (
                            <div className={style.tooltip_wrapper}>
                                <div className={style.tooltip}>
                                    <span>{item.agent}</span>
                                </div>
                            </div>
                        )}
                </td>
                <td className="column3">${item.amount.toLocaleString('en')}</td>
                <td className="column4">{item.amountTokens}</td>
                <td className="column5">{item.bonus}%</td>
                <td className="column6">{item.currencyRate}</td>
                <td
                    onMouseEnter={() => this.handleShowTooltip(2)}
                    onMouseLeave={() => this.handleHideTooltip(2)}
                    className="column7"
                >
                    <span className={style.text_overflow}>{item.bankId}</span>

                    {id === 2 &&
                        show && (
                            <div className={style.tooltip_wrapper}>
                                <div className={style.tooltip}>
                                    <span>{item.bankId}</span>
                                    <Clipboard component="p" data-clipboard-text={item.bankId}>
                                        Click to copy
                                    </Clipboard>
                                </div>
                            </div>
                        )}
                </td>
                <td className="column8">{moment(item.time).format('DD.MM.YYYY HH:mm')}</td>
            </tr>
        );
    }
}

export default TItem;

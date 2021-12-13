/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
class OrderStats extends React.Component {
  render() {
    const { orderStats } = this.props;

    if (_.isEmpty(orderStats)) {
      return '';
    }

    return (
      <div className='order-stats-wrapper bg-dark p-2 px-3 mb-2'>
        <div className='order-stat-wrapper'>
          <span className='order-stat-label'>未结买单</span>
          <span className='order-stat-value text-info'>
            {orderStats.numberOfBuyOpenOrders}
          </span>
        </div>
        <div className='order-stat-wrapper'>
          <span className='order-stat-label'>未完成交易</span>
          <span className='order-stat-value text-info'>
            {orderStats.numberOfOpenTrades}
          </span>
        </div>
      </div>
    );
  }
}

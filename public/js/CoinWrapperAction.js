/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
class CoinWrapperAction extends React.Component {
  render() {
    const {
      symbolInfo: {
        symbol,
        action,
        buy,
        isLocked,
        isActionDisabled,
        overrideData
      },
      sendWebSocket,
      isAuthenticated
    } = this.props;

    let label;
    switch (action) {
      case 'buy':
        label = '买入';
        break;
      case 'buy-temporary-disabled':
        label = '暂停买入';
        break;
      case 'buy-order-checking':
        label = '核对买单';
        break;
      case 'buy-order-wait':
        label = '等待买入';
        break;
      case 'sell':
        label = '卖出';
        break;
      case 'sell-temporary-disabled':
        label = '暂停卖出';
        break;
      case 'sell-stop-loss':
        label = '止损卖出';
        break;
      case 'sell-order-checking':
        label = '核对卖单';
        break;
      case 'sell-order-wait':
        label = '等待卖出';
        break;
      case 'sell-wait':
        label = '等待中';
        break;
      default:
        label = '等待中';
    }

    if (isLocked) {
      label = '已锁定';
    }

    if (isActionDisabled.isDisabled) {
      label = `已被${isActionDisabled.disabledBy}禁用`;
    }

    let renderOverrideAction = '';
    if (_.isEmpty(overrideData) === false) {
      renderOverrideAction = (
        <div className='coin-info-column coin-info-column-title border-bottom-0 m-0 p-0'>
          <div
            className='bg-light text-dark w-100 px-1'
            title={overrideData.actionAt}>
            任务 <strong>{overrideData.action}</strong> 将会被执行{' '}
            {moment(overrideData.actionAt).fromNow()}, 触发于{' '}
            {overrideData.triggeredBy}.
          </div>
        </div>
      );
    }

    return (
      <div className='coin-info-sub-wrapper'>
        <div className='coin-info-column coin-info-column-title border-bottom-0 mb-0 pb-0'>
          <div className='coin-info-label w-40'>
            执行状态 -{' '}
            <span className='coin-info-value'>
              {moment(buy.updatedAt).format('HH:mm:ss')}
            </span>
            {isLocked === true ? <i className='fas fa-lock ml-1'></i> : ''}
            {isActionDisabled.isDisabled === true ? (
              <i className='fas fa-pause-circle ml-1 text-warning'></i>
            ) : (
              ''
            )}
          </div>

          <div className='d-flex flex-column align-items-end w-60'>
            <HightlightChange className='action-label'>
              {label}
            </HightlightChange>
            {isActionDisabled.isDisabled === true ? (
              <div className='ml-1'>
                {isActionDisabled.canResume === true ? (
                  <SymbolEnableActionIcon
                    symbol={symbol}
                    className='mr-1'
                    sendWebSocket={sendWebSocket}
                    isAuthenticated={isAuthenticated}></SymbolEnableActionIcon>
                ) : (
                  ''
                )}
                ({moment.duration(isActionDisabled.ttl, '分钟').humanize()}{' '}
                过去了){' '}
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        {renderOverrideAction}
      </div>
    );
  }
}

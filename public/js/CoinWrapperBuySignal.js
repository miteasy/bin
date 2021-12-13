/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
class CoinWrapperBuySignal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };

    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  toggleCollapse() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    const {
      symbolInfo: {
        symbolInfo: {
          symbol,
          filterPrice: { tickSize }
        },
        quoteAssetBalance: { asset: quoteAsset },
        symbolConfiguration,
        buy,
        sell
      },
      sendWebSocket,
      isAuthenticated
    } = this.props;
    const { collapsed } = this.state;

    const precision = parseFloat(tickSize) === 1 ? 0 : tickSize.indexOf(1) - 1;

    const {
      buy: { currentGridTradeIndex, gridTrade }
    } = symbolConfiguration;

    const buyGridRows = gridTrade.map((grid, i) => {
      return (
        <React.Fragment key={'coin-wrapper-buy-grid-row-' + symbol + '-' + i}>
          <div className='coin-info-column-grid'>
            <div className='coin-info-column coin-info-column-price'>
              <div className='coin-info-label'>买单 #{i + 1}</div>

              <div className='coin-info-value'>
                {buy.openOrders.length === 0 &&
                sell.openOrders.length === 0 &&
                currentGridTradeIndex === i ? (
                  <SymbolTriggerBuyIcon
                    symbol={symbol}
                    sendWebSocket={sendWebSocket}
                    isAuthenticated={isAuthenticated}></SymbolTriggerBuyIcon>
                ) : (
                  ''
                )}

                <OverlayTrigger
                  trigger='click'
                  key={'buy-signal-' + symbol + '-' + i + '-overlay'}
                  placement='bottom'
                  overlay={
                    <Popover
                      id={'buy-signal-' + symbol + '-' + i + '-overlay-right'}>
                      <Popover.Content>
                        {grid.executed ? (
                          <React.Fragment>
                            <span>
                              买单#{i + 1} 已成交。{' '}
                              {moment(grid.executedOrder.updateTime).fromNow()}{' '}
                              ({moment(grid.executedOrder.updateTime).format()}
                              ).
                            </span>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            买单 #{i + 1} 没有成交。{' '}
                            {sell.lastBuyPrice > 0
                              ? i === 0
                                ? `此买单将不会被执行，因为记录了最后的买入价并且第一次买单没有被执行。`
                                : currentGridTradeIndex === i
                                ? `等待被执行。`
                                : `等待买单 #${i} 被执行。`
                              : currentGridTradeIndex === i
                              ? `等待被执行。`
                              : `等待买单 #${i} 被执行。`}
                          </React.Fragment>
                        )}
                      </Popover.Content>
                    </Popover>
                  }>
                  <Button
                    variant='link'
                    className='p-0 m-0 ml-1 text-warning d-inline-block'
                    style={{ lineHeight: '17px' }}>
                    {grid.executed ? (
                      // If already executed, then shows executed icon.
                      <i className='fas fa-check-square'></i>
                    ) : sell.lastBuyPrice > 0 ? (
                      i === 0 ? (
                        <i className='far fa-clock text-muted'></i>
                      ) : currentGridTradeIndex === i ? (
                        <i className='far fa-clock'></i>
                      ) : (
                        <i className='far fa-clock text-muted'></i>
                      )
                    ) : currentGridTradeIndex === i ? (
                      <i className='far fa-clock'></i>
                    ) : (
                      <i className='far fa-clock text-muted'></i>
                    )}
                  </Button>
                </OverlayTrigger>

                <button
                  type='button'
                  className='btn btn-sm btn-link p-0 ml-1'
                  onClick={this.toggleCollapse}>
                  <i
                    className={`fas ${
                      collapsed ? 'fa-arrow-right' : 'fa-arrow-down'
                    }`}></i>
                </button>
              </div>
            </div>

            {buy.triggerPrice && currentGridTradeIndex === i ? (
              <div className='coin-info-column coin-info-column-price'>
                <div
                  className='coin-info-label d-flex flex-row justify-content-start'
                  style={{ flex: '0 100%' }}>
                  <span>
                    &#62; 触发买入价格 (
                    {(parseFloat(grid.triggerPercentage - 1) * 100).toFixed(2)}
                    %):
                  </span>
                  {i === 0 &&
                  symbolConfiguration.buy.athRestriction.enabled &&
                  parseFloat(buy.triggerPrice) >
                    parseFloat(buy.athRestrictionPrice) ? (
                    <OverlayTrigger
                      trigger='click'
                      key='buy-trigger-price-overlay'
                      placement='bottom'
                      overlay={
                        <Popover id='buy-trigger-price-overlay-right'>
                          <Popover.Content>
                            触发价格{' '}
                            <code>
                              {parseFloat(buy.triggerPrice).toFixed(precision)}
                            </code>{' '}
                            高于 ATH 买入限制价{' '}
                            <code>
                              {parseFloat(buy.athRestrictionPrice).toFixed(
                                precision
                              )}
                            </code>
                            . 即使当前价格达到触发价格，机器人也不会下订单。
                          </Popover.Content>
                        </Popover>
                      }>
                      <Button
                        variant='link'
                        className='p-0 m-0 ml-1 text-warning d-inline-block'
                        style={{ lineHeight: '17px' }}>
                        <i className='fas fa-info-circle fa-sm'></i>
                      </Button>
                    </OverlayTrigger>
                  ) : (
                    ''
                  )}
                </div>
                <HightlightChange className='coin-info-value'>
                  {parseFloat(buy.triggerPrice).toFixed(precision)}
                </HightlightChange>
              </div>
            ) : (
              ''
            )}
            {buy.difference && currentGridTradeIndex === i ? (
              <div className='coin-info-column coin-info-column-price'>
                <span className='coin-info-label'>触发买入价差百分比:</span>
                <HightlightChange
                  className='coin-info-value'
                  id='buy-difference'>
                  {parseFloat(buy.difference).toFixed(2)}%
                </HightlightChange>
              </div>
            ) : (
              ''
            )}

            <div
              className={`coin-info-content-setting ${
                collapsed ? 'd-none' : ''
              }`}>
              <div className='coin-info-column coin-info-column-order'>
                <span className='coin-info-label'>
                  - 触发购买价格百分比:
                </span>
                <div className='coin-info-value'>
                  {((grid.triggerPercentage - 1) * 100).toFixed(2)}%
                </div>
              </div>
              <div className='coin-info-column coin-info-column-order'>
                <span className='coin-info-label'>
                  - 追低关单价格百分比:
                </span>
                <div className='coin-info-value'>
                  {((grid.stopPercentage - 1) * 100).toFixed(2)}%
                </div>
              </div>
              <div className='coin-info-column coin-info-column-order'>
                <span className='coin-info-label'>
                  - 限价买入挂单价格百分比:
                </span>
                <div className='coin-info-value'>
                  {((grid.limitPercentage - 1) * 100).toFixed(2)}%
                </div>
              </div>
              {grid.minPurchaseAmount > 0 ? (
                <div className='coin-info-column coin-info-column-order'>
                  <span className='coin-info-label'>
                    - 最低购买金额:
                  </span>
                  <div className='coin-info-value'>
                    {grid.minPurchaseAmount} {quoteAsset}
                  </div>
                </div>
              ) : (
                ''
              )}
              <div className='coin-info-column coin-info-column-order'>
                <span className='coin-info-label'>- 最大买入金额:</span>
                <div className='coin-info-value'>
                  {grid.maxPurchaseAmount} {quoteAsset}
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });

    return (
      <div className='coin-info-sub-wrapper'>
        <div className='coin-info-column coin-info-column-title'>
          <div className='coin-info-label'>
            买入信号 (计算区间：{symbolConfiguration.candles.interval}/
            {symbolConfiguration.candles.limit}个蜡烛){' '}
            <span className='coin-info-value'>
              {symbolConfiguration.buy.enabled ? (
                <i className='fas fa-toggle-on'></i>
              ) : (
                <i className='fas fa-toggle-off'></i>
              )}
            </span>{' '}
          </div>
          {symbolConfiguration.buy.enabled === false ? (
            <HightlightChange className='coin-info-message text-muted'>
              已关闭买入.
            </HightlightChange>
          ) : (
            ''
          )}
        </div>
        {symbolConfiguration.buy.athRestriction.enabled ? (
          <div className='d-flex flex-column w-100'>
            {buy.athPrice ? (
              <div className='coin-info-column coin-info-column-price'>
                <span className='coin-info-label'>
                  ATH 价格 (
                  {symbolConfiguration.buy.athRestriction.candles.interval}/
                  {symbolConfiguration.buy.athRestriction.candles.limit}):
                </span>
                <HightlightChange className='coin-info-value'>
                  {parseFloat(buy.athPrice).toFixed(precision)}
                </HightlightChange>
              </div>
            ) : (
              ''
            )}
            {buy.athRestrictionPrice ? (
              <div className='coin-info-column coin-info-column-price'>
                <div
                  className='coin-info-label d-flex flex-row justify-content-start'
                  style={{ flex: '0 100%' }}>
                  <span>
                    &#62; 限价(
                    {(
                      parseFloat(
                        symbolConfiguration.buy.athRestriction
                          .restrictionPercentage - 1
                      ) * 100
                    ).toFixed(2)}
                    %):
                  </span>
                  <OverlayTrigger
                    trigger='click'
                    key='buy-ath-restricted-price-overlay'
                    placement='bottom'
                    overlay={
                      <Popover id='buy-ath-restricted-price-overlay-right'>
                        <Popover.Content>
                          当触发价格低于 ATH 限制价格时，机器人将下达买单。 即使当前价格达到触发价格，如果当前价格高于 ATH 限制价格，机器人也不会购买硬币。 如果您不想使用ATH限制购买，请在设置中禁用ATH价格限制。
                        </Popover.Content>
                      </Popover>
                    }>
                    <Button
                      variant='link'
                      className='p-0 m-0 ml-1 text-info d-inline-block'
                      style={{ lineHeight: '17px' }}>
                      <i className='fas fa-question-circle fa-sm'></i>
                    </Button>
                  </OverlayTrigger>
                </div>
                <HightlightChange className='coin-info-value'>
                  {parseFloat(buy.athRestrictionPrice).toFixed(precision)}
                </HightlightChange>
              </div>
            ) : (
              ''
            )}
            <div className='coin-info-column coin-info-column-price divider'></div>
          </div>
        ) : (
          ''
        )}

        {buy.highestPrice ? (
          <div className='coin-info-column coin-info-column-price'>
            <span className='coin-info-label'>区间最高价格:</span>
            <HightlightChange className='coin-info-value'>
              {parseFloat(buy.highestPrice).toFixed(precision)}
            </HightlightChange>
          </div>
        ) : (
          ''
        )}
        {buy.currentPrice ? (
          <div className='coin-info-column coin-info-column-price'>
            <span className='coin-info-label'>当前实时价格:</span>
            <HightlightChange className='coin-info-value'>
              {parseFloat(buy.currentPrice).toFixed(precision)}
            </HightlightChange>
          </div>
        ) : (
          ''
        )}
        {buy.lowestPrice ? (
          <div className='coin-info-column coin-info-column-lowest-price'>
            <span className='coin-info-label'>区间最低价格:</span>
            <HightlightChange className='coin-info-value'>
              {parseFloat(buy.lowestPrice).toFixed(precision)}
            </HightlightChange>
          </div>
        ) : (
          ''
        )}
        <div className='coin-info-column coin-info-column-price divider mb-1'></div>
        {buyGridRows}
        {buy.processMessage ? (
          <div className='d-flex flex-column w-100'>
            <div className='coin-info-column coin-info-column-price divider'></div>
            <div className='coin-info-column coin-info-column-message'>
              <HightlightChange className='coin-info-message'>
                {buy.processMessage}
              </HightlightChange>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
class CoinWrapperSetting extends React.Component {
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

  isCustomised = configurationKeyName =>
    configurationKeyName !== 'configuration';

  render() {
    const { collapsed } = this.state;
    const { symbolInfo } = this.props;
    const { symbolConfiguration } = symbolInfo;

    const {
      symbol,
      quoteAssetBalance: { asset: quoteAsset }
    } = symbolInfo;

    const {
      key: configurationKeyName,
      buy: { gridTrade: buyGridTrade },
      sell: { gridTrade: sellGridTrade }
    } = symbolConfiguration;

    const buyGridRows = buyGridTrade.map((grid, i) => {
      return (
        <React.Fragment
          key={'coin-wrapper-setting-buy-grid-row-' + symbol + '-' + i}>
          <div className='coin-info-column-grid'>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>买单 #{i + 1}</span>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>
                触底价{' '}
                <strong>
                  {i === 0 ? `(最低价)` : `(最后买入价)`}
                </strong>
                :
              </span>
              <div className='coin-info-value'>
                {(parseFloat(grid.triggerPercentage - 1) * 100).toFixed(2)}%
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>挂单价:</span>
              <div className='coin-info-value'>
                {(parseFloat(grid.stopPercentage - 1) * 100).toFixed(2)}%
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>委托价:</span>
              <div className='coin-info-value'>
                {(parseFloat(grid.limitPercentage - 1) * 100).toFixed(2)}%
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>最小买入金额:</span>
              <div className='coin-info-value'>
                {grid.minPurchaseAmount} {quoteAsset}
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>最大买入金额:</span>
              <div className='coin-info-value'>
                {grid.maxPurchaseAmount} {quoteAsset}
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });

    const sellGridRows = sellGridTrade.map((grid, i) => {
      return (
        <React.Fragment
          key={'coin-wrapper-setting-sell-grid-row-' + symbol + '-' + i}>
          <div className='coin-info-column-grid'>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>卖单 #{i + 1}</span>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>触顶价:</span>
              <div className='coin-info-value'>
                {(parseFloat(grid.triggerPercentage - 1) * 100).toFixed(2)}%
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>挂单价:</span>
              <div className='coin-info-value'>
                {(parseFloat(grid.stopPercentage - 1) * 100).toFixed(2)}%
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>委托价:</span>
              <div className='coin-info-value'>
                {(parseFloat(grid.limitPercentage - 1) * 100).toFixed(2)}%
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>平仓数(%):</span>
              <div className='coin-info-value'>
                {(parseFloat(grid.quantityPercentage) * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });

    return (
      <div className='coin-info-sub-wrapper coin-info-sub-wrapper-setting'>
        <div className='coin-info-column coin-info-column-title coin-info-column-title-setting'>
          <div className='coin-info-label'>
            <div className='mr-1'>
              交易配置{' '}
              {this.isCustomised(configurationKeyName) ? (
                <Badge pill variant='warning'>
                  自定义模式
                </Badge>
              ) : (
                <Badge pill variant='light'>
                  全局模式
                </Badge>
              )}
            </div>
          </div>

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
        <div
          className={`coin-info-content-setting ${collapsed ? 'd-none' : ''}`}>
          <div className='coin-info-sub-wrapper'>
            <div className='coin-info-sub-label'>计算区间</div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>K线大小:</span>
              <div className='coin-info-value'>
                {symbolConfiguration.candles.interval}
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>K线数量:</span>
              <div className='coin-info-value'>
                {symbolConfiguration.candles.limit}
              </div>
            </div>
          </div>

          <div className='coin-info-sub-wrapper'>
            <div className='coin-info-sub-label'>【买入信号】</div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>启用:</span>
              <span className='coin-info-value'>
                {symbolConfiguration.buy.enabled ? (
                  <i className='fas fa-toggle-on'></i>
                ) : (
                  <i className='fas fa-toggle-off'></i>
                )}
              </span>
            </div>
            {buyGridRows}
          </div>
          <div className='coin-info-sub-wrapper'>
            <div className='coin-info-sub-label'>
              买入 - [最后买入价]移除阈值
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>
                移除[最后买入价]，当价格低于:
              </span>
              <div className='coin-info-value'>
                {symbolConfiguration.buy.lastBuyPriceRemoveThreshold}{' '}
                {quoteAsset}
              </div>
            </div>
          </div>
          <div className='coin-info-sub-wrapper'>
            <div className='coin-info-sub-label'>
              买入 - ATH价格限制
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>启用:</span>
              <span className='coin-info-value'>
                {symbolConfiguration.buy.athRestriction.enabled ? (
                  <i className='fas fa-toggle-on'></i>
                ) : (
                  <i className='fas fa-toggle-off'></i>
                )}
              </span>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>计算区间 - K线大小:</span>
              <div className='coin-info-value'>
                {symbolConfiguration.buy.athRestriction.candles.interval}
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>计算区间 - K线数量:</span>
              <div className='coin-info-value'>
                {symbolConfiguration.buy.athRestriction.candles.limit}
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>限制百分比:</span>
              <div className='coin-info-value'>
                {(
                  (symbolConfiguration.buy.athRestriction
                    .restrictionPercentage -
                    1) *
                  100
                ).toFixed(2)}
                %
              </div>
            </div>
          </div>
          <div className='coin-info-sub-wrapper'>
            <div className='coin-info-sub-label'>买入 - TradingView</div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>
                当推荐值为<code>Strong buy</code>时才允许买入:
              </span>
              <span className='coin-info-value'>
                {symbolConfiguration.buy.tradingView.whenStrongBuy ? (
                  <i className='fas fa-toggle-on'></i>
                ) : (
                  <i className='fas fa-toggle-off'></i>
                )}
              </span>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>
                当推荐值为<code>Buy</code>时才允许买入:
              </span>
              <span className='coin-info-value'>
                {symbolConfiguration.buy.tradingView.whenBuy ? (
                  <i className='fas fa-toggle-on'></i>
                ) : (
                  <i className='fas fa-toggle-off'></i>
                )}
              </span>
            </div>
          </div>

          <div className='coin-info-sub-wrapper'>
            <div className='coin-info-sub-label'>【卖出信号】</div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>启用:</span>
              <span className='coin-info-value'>
                {symbolConfiguration.sell.enabled ? (
                  <i className='fas fa-toggle-on'></i>
                ) : (
                  <i className='fas fa-toggle-off'></i>
                )}
              </span>
            </div>
            {sellGridRows}
          </div>

          <div className='coin-info-sub-wrapper'>
            <div className='coin-info-sub-label'>卖出 - 止损</div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>启用:</span>
              <span className='coin-info-value'>
                {symbolConfiguration.sell.stopLoss.enabled ? (
                  <i className='fas fa-toggle-on'></i>
                ) : (
                  <i className='fas fa-toggle-off'></i>
                )}
              </span>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>最大亏损率:</span>
              <div className='coin-info-value'>
                {(
                  (symbolConfiguration.sell.stopLoss.maxLossPercentage - 1) *
                  100
                ).toFixed(2)}
                %
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>暂停买入时间:</span>
              <div className='coin-info-value'>
                {moment
                  .duration(
                    symbolConfiguration.sell.stopLoss.disableBuyMinutes,
                    'minutes'
                  )
                  .humanize()}
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>成交方式:</span>
              <div className='coin-info-value'>
                {symbolConfiguration.sell.stopLoss.orderType}
              </div>
            </div>
          </div>

          <div className='coin-info-sub-wrapper'>
            <div className='coin-info-sub-label'>卖出 - TradingView</div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>
                当建议为<code>Neutral</code>时才允许卖出:
              </span>
              <span className='coin-info-value'>
                {symbolConfiguration.sell.tradingView
                  .forceSellOverZeroBelowTriggerPrice.whenNeutral ? (
                  <i className='fas fa-toggle-on'></i>
                ) : (
                  <i className='fas fa-toggle-off'></i>
                )}
              </span>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>
              当建议为<code>Sell</code>时才允许卖出:
              </span>
              <span className='coin-info-value'>
                {symbolConfiguration.sell.tradingView
                  .forceSellOverZeroBelowTriggerPrice.whenSell ? (
                  <i className='fas fa-toggle-on'></i>
                ) : (
                  <i className='fas fa-toggle-off'></i>
                )}
              </span>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>
              当建议为<code>Strong sell</code>时才允许卖出:
              </span>
              <span className='coin-info-value'>
                {symbolConfiguration.sell.tradingView
                  .forceSellOverZeroBelowTriggerPrice.whenStrongSell ? (
                  <i className='fas fa-toggle-on'></i>
                ) : (
                  <i className='fas fa-toggle-off'></i>
                )}
              </span>
            </div>
          </div>

          <div className='coin-info-sub-wrapper'>
            <div className='coin-info-sub-label'>
              机器人设置 - 自动买入
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>启用:</span>
              <span className='coin-info-value'>
                {symbolConfiguration.botOptions.autoTriggerBuy.enabled ? (
                  <i className='fas fa-toggle-on'></i>
                ) : (
                  <i className='fas fa-toggle-off'></i>
                )}
              </span>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>触发后时间:</span>
              <div className='coin-info-value'>
                {moment
                  .duration(
                    symbolConfiguration.botOptions.autoTriggerBuy.triggerAfter,
                    'minutes'
                  )
                  .humanize()}
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>
              当实时价格超过ATH限制时，重新安排:
              </span>
              <div className='coin-info-value'>
                {symbolConfiguration.botOptions.autoTriggerBuy.conditions
                  .whenLessThanATHRestriction ? (
                  <i className='fas fa-toggle-on'></i>
                ) : (
                  <i className='fas fa-toggle-off'></i>
                )}
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>
              当操作被禁用时，重新安排:
              </span>
              <div className='coin-info-value'>
                {symbolConfiguration.botOptions.autoTriggerBuy.conditions
                  .afterDisabledPeriod ? (
                  <i className='fas fa-toggle-on'></i>
                ) : (
                  <i className='fas fa-toggle-off'></i>
                )}
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>
                当TradingView建议是<code>Strong buy</code>时允许
                :
              </span>
              <div className='coin-info-value'>
                {symbolConfiguration.botOptions.autoTriggerBuy.conditions
                  .tradingView.whenStrongBuy ? (
                  <i className='fas fa-toggle-on'></i>
                ) : (
                  <i className='fas fa-toggle-off'></i>
                )}
              </div>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>
              当TradingView建议是<code>Buy</code>时允许:
              </span>
              <div className='coin-info-value'>
                {symbolConfiguration.botOptions.autoTriggerBuy.conditions
                  .tradingView.whenBuy ? (
                  <i className='fas fa-toggle-on'></i>
                ) : (
                  <i className='fas fa-toggle-off'></i>
                )}
              </div>
            </div>
          </div>

          <div className='coin-info-sub-wrapper'>
            <div className='coin-info-sub-label'>机器人设置 - TradingView</div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>K线大小:</span>
              <span className='coin-info-value'>
                {symbolConfiguration.botOptions.tradingView.interval !== ''
                  ? symbolConfiguration.botOptions.tradingView.interval
                  : symbolConfiguration.candles.interval}
              </span>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>
                仅使用在此更新时间之内的建议:
              </span>
              <span className='coin-info-value'>
                {symbolConfiguration.botOptions.tradingView.useOnlyWithin}
              </span>
            </div>
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>
                如果数据通过 "仅使用在内部更新过的数据":
              </span>
              <span className='coin-info-value'>
                {symbolConfiguration.botOptions.tradingView.ifExpires ===
                'ignore'
                  ? '忽略数据'
                  : '不建议买入'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

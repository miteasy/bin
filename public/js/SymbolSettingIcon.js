/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
class SymbolSettingIcon extends React.Component {
  constructor(props) {
    super(props);

    this.modalToStateMap = {
      setting: 'showSettingModal',
      confirm: 'showConfirmModal',
      gridTrade: 'showResetGridTradeModal'
    };

    this.state = {
      showSettingModal: false,
      showConfirmModal: false,
      showResetGridTradeModal: false,
      symbolConfiguration: {},
      validation: {}
    };

    this.handleModalShow = this.handleModalShow.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetToGlobalConfiguration =
      this.resetToGlobalConfiguration.bind(this);
    this.handleGridTradeChange = this.handleGridTradeChange.bind(this);
    this.handleBotOptionsChange = this.handleBotOptionsChange.bind(this);

    this.handleSetValidation = this.handleSetValidation.bind(this);
  }

  componentDidUpdate(nextProps) {
    // Only update symbol configuration, when the modal is closed and different.
    if (
      this.state.showSettingModal === false &&
      _.get(nextProps, 'symbolInfo.symbolConfiguration', null) !== null &&
      _.isEqual(
        _.get(nextProps, 'symbolInfo.symbolConfiguration', null),
        this.state.symbolConfiguration
      ) === false
    ) {
      this.setState({
        symbolConfiguration: nextProps.symbolInfo.symbolConfiguration
      });
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();

    this.handleModalClose('setting');

    // Send with symbolInfo
    const { symbolInfo } = this.props;
    const newSymbolInfo = symbolInfo;
    newSymbolInfo.configuration = this.state.symbolConfiguration;

    this.props.sendWebSocket('symbol-setting-update', newSymbolInfo);
  }

  handleModalShow(modal) {
    this.setState({
      [this.modalToStateMap[modal]]: true
    });
  }

  handleModalClose(modal) {
    this.setState({
      [this.modalToStateMap[modal]]: false
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value =
      target.type === 'checkbox'
        ? target.checked
        : target.type === 'number'
        ? +target.value
        : target.value;
    const stateKey = target.getAttribute('data-state-key');

    const { symbolConfiguration } = this.state;

    this.setState({
      symbolConfiguration: _.set(symbolConfiguration, stateKey, value)
    });
  }

  resetToGlobalConfiguration() {
    const { symbolInfo } = this.props;

    this.handleModalClose('confirm');
    this.handleModalClose('setting');
    this.handleModalClose('gridTrade');
    this.props.sendWebSocket('symbol-setting-delete', symbolInfo);
  }

  resetGridTrade(action) {
    const { symbolInfo } = this.props;

    this.handleModalClose('confirm');
    this.handleModalClose('setting');
    this.handleModalClose('gridTrade');
    this.props.sendWebSocket('symbol-grid-trade-delete', {
      action,
      symbol: symbolInfo.symbol
    });
  }

  handleGridTradeChange(type, newGrid) {
    const { symbolConfiguration } = this.state;

    this.setState({
      symbolConfiguration: _.set(
        symbolConfiguration,
        `${type}.gridTrade`,
        newGrid
      )
    });
  }

  handleBotOptionsChange(newBotOptions) {
    const { symbolConfiguration } = this.state;

    this.setState({
      symbolConfiguration: _.set(
        symbolConfiguration,
        'botOptions',
        newBotOptions
      )
    });
  }

  handleSetValidation(type, isValid) {
    const { validation } = this.state;
    this.setState({ validation: { ...validation, [type]: isValid } });
  }

  render() {
    const { symbolInfo, isAuthenticated } = this.props;
    const { symbolConfiguration } = this.state;

    if (_.isEmpty(symbolConfiguration) || isAuthenticated === false) {
      return '';
    }

    const {
      symbolInfo: { quoteAsset, filterMinNotional }
    } = symbolInfo;
    const minNotional = parseFloat(filterMinNotional.minNotional);

    return (
      <div className='symbol-setting-icon-wrapper'>
        <button
          type='button'
          className='btn btn-sm btn-link p-0'
          onClick={() => this.handleModalShow('setting')}>
          <i className='fas fa-cog'></i>
        </button>
        <Modal
          show={this.state.showSettingModal}
          onHide={() => this.handleModalClose('setting')}
          size='xl'>
          <Form onSubmit={this.handleFormSubmit}>
            <Modal.Header className='pt-1 pb-1'>
              <Modal.Title>自定义设置 {symbolInfo.symbol} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <span className='text-muted'>
              在此模式中，您可以覆盖特定符号。请确保您了解设置是关于更改配置值之前的设置。
              笔记这些是特定于符号的设置，这意味着符号将应用于设置。
              </span>

              <Accordion defaultActiveKey='0'>
                <Card className='mt-1'>
                  <Card.Header className='px-2 py-1'>
                    <Accordion.Toggle
                      as={Button}
                      variant='link'
                      eventKey='0'
                      className='p-0 fs-7 text-uppercase'>
                      计算区间设置
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey='0'>
                    <Card.Body className='px-2 py-1'>
                      <div className='row'>
                        <div className='col-6'>
                          <Form.Group
                            controlId='field-candles-interval'
                            className='mb-2'>
                            <Form.Label className='mb-0'>
                              K线大小
                              <OverlayTrigger
                                trigger='click'
                                key='interval-overlay'
                                placement='bottom'
                                overlay={
                                  <Popover id='interval-overlay-right'>
                                    <Popover.Content>
                                      会基于K线的间隔大小计算最高价/最低价
                                    </Popover.Content>
                                  </Popover>
                                }>
                                <Button
                                  variant='link'
                                  className='p-0 m-0 ml-1 text-info'>
                                  <i className='fas fa-question-circle fa-sm'></i>
                                </Button>
                              </OverlayTrigger>
                            </Form.Label>
                            <Form.Control
                              size='sm'
                              as='select'
                              required
                              data-state-key='candles.interval'
                              value={symbolConfiguration.candles.interval}
                              onChange={this.handleInputChange}>
                              <option value='1m'>1分钟</option>
                              <option value='3m'>3分钟</option>
                              <option value='5m'>5分钟</option>
                              <option value='15m'>15分钟</option>
                              <option value='30m'>30分钟</option>
                              <option value='1h'>1小时</option>
                              <option value='2h'>2小时</option>
                              <option value='4h'>4小时</option>
                              <option value='1d'>1天</option>
                            </Form.Control>
                          </Form.Group>
                        </div>
                        <div className='col-6'>
                          <Form.Group
                            controlId='field-candles-limit'
                            className='mb-2'>
                            <Form.Label className='mb-0'>
                              K线数量{' '}
                              <OverlayTrigger
                                trigger='click'
                                key='limit-overlay'
                                placement='bottom'
                                overlay={
                                  <Popover id='limit-overlay-right'>
                                    <Popover.Content>
                                      要检索的K线数量，用于计算最高价/最低价
                                    </Popover.Content>
                                  </Popover>
                                }>
                                <Button
                                  variant='link'
                                  className='p-0 m-0 ml-1 text-info'>
                                  <i className='fas fa-question-circle fa-sm'></i>
                                </Button>
                              </OverlayTrigger>
                            </Form.Label>
                            <Form.Control
                              size='sm'
                              type='number'
                              placeholder='Enter limit'
                              required
                              min='0'
                              step='1'
                              data-state-key='candles.limit'
                              value={symbolConfiguration.candles.limit}
                              onChange={this.handleInputChange}
                            />
                          </Form.Group>
                        </div>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              <Accordion defaultActiveKey='0'>
                <Card className='mt-1'>
                  <Card.Header className='px-2 py-1'>
                    <Accordion.Toggle
                      as={Button}
                      variant='link'
                      eventKey='0'
                      className='p-0 fs-7 text-uppercase'>
                      买入配置
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey='0'>
                    <Card.Body className='px-2 py-1'>
                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group
                            controlId='field-buy-enabled'
                            className='mb-2'>
                            <Form.Check size='sm'>
                              <Form.Check.Input
                                type='checkbox'
                                data-state-key='buy.enabled'
                                checked={symbolConfiguration.buy.enabled}
                                onChange={this.handleInputChange}
                              />
                              <Form.Check.Label>
                                启用{' '}
                                <OverlayTrigger
                                  trigger='click'
                                  key='buy-enabled-overlay'
                                  placement='bottom'
                                  overlay={
                                    <Popover id='buy-enabled-overlay-right'>
                                      <Popover.Content>
                                      如果启用，则bot当它检测到购买信号时买币。如果如果已禁用，则bot将不会买币，但继续监测。市场不稳定的时候，你可以暂时禁用。
                                      </Popover.Content>
                                    </Popover>
                                  }>
                                  <Button
                                    variant='link'
                                    className='p-0 m-0 ml-1 text-info'>
                                    <i className='fas fa-question-circle fa-sm'></i>
                                  </Button>
                                </OverlayTrigger>
                              </Form.Check.Label>
                            </Form.Check>
                          </Form.Group>
                        </div>

                        <div className='col-12'>
                          <SymbolSettingIconGridBuy
                            gridTrade={symbolConfiguration.buy.gridTrade}
                            quoteAsset={quoteAsset}
                            minNotional={minNotional}
                            handleSetValidation={this.handleSetValidation}
                            handleGridTradeChange={this.handleGridTradeChange}
                          />
                        </div>
                        <div className='col-12'>
                          <Accordion defaultActiveKey='0'>
                            <Card className='mt-1'>
                              <Card.Header className='px-2 py-1'>
                                <Accordion.Toggle
                                  as={Button}
                                  variant='link'
                                  eventKey='0'
                                  className='p-0 fs-7 text-uppercase'>
                                   [最后买入价]移除阈值
                                </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey='0'>
                                <Card.Body className='px-2 py-1'>
                                  <Form.Group
                                    controlId='field-last-buy-remove-threshold'
                                    className='mb-2'>
                                    <Form.Label className='mb-0'>
                                    移除[最后买入价]，当价格低于:{' '}
                                      <OverlayTrigger
                                        trigger='click'
                                        key='last-buy-remove-threshold-overlay'
                                        placement='bottom'
                                        overlay={
                                          <Popover id='last-buy-remove-threshold-overlay-right'>
                                            <Popover.Content>
                                            设定上次购买价格门槛估计值下降到阈值以下，机器人将删除最后一次购买价格
                                            </Popover.Content>
                                          </Popover>
                                        }>
                                        <Button
                                          variant='link'
                                          className='p-0 m-0 ml-1 text-info'>
                                          <i className='fas fa-question-circle fa-sm'></i>
                                        </Button>
                                      </OverlayTrigger>
                                    </Form.Label>
                                    <Form.Control
                                      size='sm'
                                      type='number'
                                      placeholder='Enter last buy threshold'
                                      required
                                      min='0.00000001'
                                      step='0.00000001'
                                      data-state-key='buy.lastBuyPriceRemoveThreshold'
                                      value={
                                        symbolConfiguration.buy
                                          .lastBuyPriceRemoveThreshold
                                      }
                                      onChange={this.handleInputChange}
                                    />
                                  </Form.Group>
                                </Card.Body>
                              </Accordion.Collapse>
                            </Card>
                          </Accordion>
                        </div>
                      </div>

                      <Accordion defaultActiveKey='0'>
                        <Card className='mt-1'>
                          <Card.Header className='px-2 py-1'>
                            <Accordion.Toggle
                              as={Button}
                              variant='link'
                              eventKey='0'
                              className='p-0 fs-7 text-uppercase'>
                              买入 - ATH价格限制 (All Time High)
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey='0'>
                            <Card.Body className='px-2 py-1'>
                              <div className='row'>
                                <div className='col-12'>
                                  <Form.Group
                                    controlId='field-buy-ath-restriction-enabled'
                                    className='mb-2'>
                                    <Form.Check size='sm'>
                                      <Form.Check.Input
                                        type='checkbox'
                                        data-state-key='buy.athRestriction.enabled'
                                        checked={
                                          symbolConfiguration.buy.athRestriction
                                            .enabled
                                        }
                                        onChange={this.handleInputChange}
                                      />
                                      <Form.Check.Label>
                                        ATH启用{' '}
                                        <OverlayTrigger
                                          trigger='click'
                                          key='buy-ath-restriction-enabled-overlay'
                                          placement='bottom'
                                          overlay={
                                            <Popover id='buy-ath-restriction-enabled-overlay-right'>
                                              <Popover.Content>
                                              如果启用，则bot将检索ATH（区间最高价）币的价格基于间隔/蜡烛配置。
                                              如果购买触发价为高于购买限制价格，由以下公式计算：限制价格百分比，
                                              则bot将不会下购买订单。机器人会触发时下命令价格比买的便宜限价。
                                              </Popover.Content>
                                            </Popover>
                                          }>
                                          <Button
                                            variant='link'
                                            className='p-0 m-0 ml-1 text-info'>
                                            <i className='fas fa-question-circle fa-sm'></i>
                                          </Button>
                                        </OverlayTrigger>
                                      </Form.Check.Label>
                                    </Form.Check>
                                  </Form.Group>
                                </div>

                                <div className='col-xs-12 col-sm-6'>
                                  <Form.Group
                                    controlId='field-ath-candles-interval'
                                    className='mb-2'>
                                    <Form.Label className='mb-0'>
                                      K线大小
                                      <OverlayTrigger
                                        trigger='click'
                                        key='interval-overlay'
                                        placement='bottom'
                                        overlay={
                                          <Popover id='interval-overlay-right'>
                                            <Popover.Content>
                                              设置ATH (All The High)计算的K线大小
                                            </Popover.Content>
                                          </Popover>
                                        }>
                                        <Button
                                          variant='link'
                                          className='p-0 m-0 ml-1 text-info'>
                                          <i className='fas fa-question-circle fa-sm'></i>
                                        </Button>
                                      </OverlayTrigger>
                                    </Form.Label>
                                    <Form.Control
                                      size='sm'
                                      as='select'
                                      required
                                      data-state-key='buy.athRestriction.candles.interval'
                                      value={
                                        symbolConfiguration.buy.athRestriction
                                          .candles.interval
                                      }
                                      onChange={this.handleInputChange}>
                                      <option value='1m'>1分钟</option>
                                      <option value='3m'>3分钟</option>
                                      <option value='5m'>5分钟</option>
                                      <option value='15m'>15分钟</option>
                                      <option value='30m'>30分钟</option>
                                      <option value='1h'>1小时</option>
                                      <option value='2h'>2小时</option>
                                      <option value='4h'>4小时</option>
                                      <option value='1d'>1天</option>
                                    </Form.Control>
                                  </Form.Group>
                                </div>
                                <div className='col-xs-12 col-sm-6'>
                                  <Form.Group
                                    controlId='field-ath-candles-limit'
                                    className='mb-2'>
                                    <Form.Label className='mb-0'>
                                      K线数量
                                      <OverlayTrigger
                                        trigger='click'
                                        key='limit-overlay'
                                        placement='bottom'
                                        overlay={
                                          <Popover id='limit-overlay-right'>
                                            <Popover.Content>
                                              设置计算ATH(All The High)价格的K线数量.
                                            </Popover.Content>
                                          </Popover>
                                        }>
                                        <Button
                                          variant='link'
                                          className='p-0 m-0 ml-1 text-info'>
                                          <i className='fas fa-question-circle fa-sm'></i>
                                        </Button>
                                      </OverlayTrigger>
                                    </Form.Label>
                                    <Form.Control
                                      size='sm'
                                      type='number'
                                      placeholder='Enter limit'
                                      required
                                      min='0'
                                      step='1'
                                      data-state-key='buy.athRestriction.candles.limit'
                                      value={
                                        symbolConfiguration.buy.athRestriction
                                          .candles.limit
                                      }
                                      onChange={this.handleInputChange}
                                    />
                                  </Form.Group>
                                </div>
                                <div className='col-xs-12 col-sm-6'>
                                  <Form.Group
                                    controlId='field-buy-restriction-percentage'
                                    className='mb-2'>
                                    <Form.Label className='mb-0'>
                                      限制价设置{' '}
                                      <OverlayTrigger
                                        trigger='click'
                                        key='interval-overlay'
                                        placement='bottom'
                                        overlay={
                                          <Popover id='interval-overlay-right'>
                                            <Popover.Content>
                                              设置要计算的限价百分比，例如： 如何设置为{' '}
                                              <code>0.9</code> 此时 ATH(All
                                              Time High) 价格为 <code>$110</code>
                                              , 那么限制价格则将{' '}
                                              <code>$99</code> 设为触发价.
                                            </Popover.Content>
                                          </Popover>
                                        }>
                                        <Button
                                          variant='link'
                                          className='p-0 m-0 ml-1 text-info'>
                                          <i className='fas fa-question-circle fa-sm'></i>
                                        </Button>
                                      </OverlayTrigger>
                                    </Form.Label>
                                    <Form.Control
                                      size='sm'
                                      type='number'
                                      placeholder='Enter restriction price percentage'
                                      required
                                      min='0'
                                      step='0.0001'
                                      data-state-key='buy.athRestriction.restrictionPercentage'
                                      value={
                                        symbolConfiguration.buy.athRestriction
                                          .restrictionPercentage
                                      }
                                      onChange={this.handleInputChange}
                                    />
                                  </Form.Group>
                                </div>
                              </div>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      </Accordion>

                      <Accordion defaultActiveKey='0'>
                        <Card className='mt-1'>
                          <Card.Header className='px-2 py-1'>
                            <Accordion.Toggle
                              as={Button}
                              variant='link'
                              eventKey='0'
                              className='p-0 fs-7 text-uppercase'>
                              TradingView{' '}
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey='0'>
                            <Card.Body className='px-2 py-1'>
                              <div className='row'>
                                <div className='col-12'>
                                  什么是{' '}
                                  <a
                                    href='https://www.tradingview.com/symbols/BTCUSDT/technicals/'
                                    target='_blank'
                                    rel='noreferrer'>
                                    TradingView
                                  </a>
                                  ?{' '}
                                  <OverlayTrigger
                                    trigger='click'
                                    key='bot-options-auto-trigger-buy-conditions-tradingview-when-strong-buy-overlay'
                                    placement='bottom'
                                    overlay={
                                      <Popover id='bot-options-auto-trigger-buy-conditions-tradingview-when-strong-buy-overlay-right'>
                                        <Popover.Content>
                                        TradingView是提供基于各种指示器，
                                        如振荡器和移动平均线。
                                        机器人是与TradingView摘要集成控制购买的建议行动
                                        </Popover.Content>
                                      </Popover>
                                    }>
                                    <Button
                                      variant='link'
                                      className='p-0 m-0 ml-1 text-info'>
                                      <i className='fas fa-question-circle fa-sm'></i>
                                    </Button>
                                  </OverlayTrigger>
                                </div>
                                <div className='col-12'>
                                  <Form.Group
                                    controlId='field-buy-tradingview-when-strong-buy'
                                    className='mb-2'>
                                    <Form.Check size='sm'>
                                      <Form.Check.Input
                                        type='checkbox'
                                        data-state-key='buy.tradingView.whenStrongBuy'
                                        checked={
                                          symbolConfiguration.buy.tradingView
                                            .whenStrongBuy
                                        }
                                        onChange={this.handleInputChange}
                                      />
                                      <Form.Check.Label>
                                        当信号为 <code>Strong buy</code>{' '}时，才允许触发{' '}
                                        <OverlayTrigger
                                          trigger='click'
                                          key='buy-tradingview-when-strong-buy-overlay'
                                          placement='bottom'
                                          overlay={
                                            <Popover id='buy-tradingview-when-strong-buy-overlay-right'>
                                              <Popover.Content>
                                              如果启用，则bot将使用TradingView推荐给触发购买。
                                              如果买家一旦达到触发价格，则机器人将检查TradingView 建议，
                                              如果不是`强买`，则机器人将不要下购买订单。
                                              </Popover.Content>
                                            </Popover>
                                          }>
                                          <Button
                                            variant='link'
                                            className='p-0 m-0 ml-1 text-info'>
                                            <i className='fas fa-question-circle fa-sm'></i>
                                          </Button>
                                        </OverlayTrigger>
                                      </Form.Check.Label>
                                    </Form.Check>
                                  </Form.Group>
                                </div>
                                <div className='col-12'>
                                  <Form.Group
                                    controlId='field-buy-tradingview-when-buy'
                                    className='mb-2'>
                                    <Form.Check size='sm'>
                                      <Form.Check.Input
                                        type='checkbox'
                                        data-state-key='buy.tradingView.whenBuy'
                                        checked={
                                          symbolConfiguration.buy.tradingView
                                            .whenBuy
                                        }
                                        onChange={this.handleInputChange}
                                      />
                                      <Form.Check.Label>
                                        当信号为{' '}<code>Buy</code>{' '}时，才允许买入{' '}
                                        <OverlayTrigger
                                          trigger='click'
                                          key='buy-tradingview-when-buy-overlay'
                                          placement='bottom'
                                          overlay={
                                            <Popover id='buy-tradingview-when-buy-overlay-right'>
                                              <Popover.Content>
                                              如果启用，则bot将使用TradingView推荐给触发购买。
                                              如果买家一旦达到触发价格，则机器人将检查TradingView建议，
                                              如果不是`购买`，则bot将不会下购买订单。
                                              </Popover.Content>
                                            </Popover>
                                          }>
                                          <Button
                                            variant='link'
                                            className='p-0 m-0 ml-1 text-info'>
                                            <i className='fas fa-question-circle fa-sm'></i>
                                          </Button>
                                        </OverlayTrigger>
                                      </Form.Check.Label>
                                    </Form.Check>
                                  </Form.Group>
                                </div>
                              </div>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      </Accordion>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              <Accordion defaultActiveKey='0'>
                <Card className='mt-1'>
                  <Card.Header className='px-2 py-1'>
                    <Accordion.Toggle
                      as={Button}
                      variant='link'
                      eventKey='0'
                      className='p-0 fs-7 text-uppercase'>
                      卖出配置
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey='0'>
                    <Card.Body className='px-2 py-1'>
                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group
                            controlId='field-sell-enabled'
                            className='mb-2'>
                            <Form.Check size='sm'>
                              <Form.Check.Input
                                type='checkbox'
                                data-state-key='sell.enabled'
                                checked={symbolConfiguration.sell.enabled}
                                onChange={this.handleInputChange}
                              />
                              <Form.Check.Label>
                                启用{' '}
                                <OverlayTrigger
                                  trigger='click'
                                  key='buy-enabled-overlay'
                                  placement='bottom'
                                  overlay={
                                    <Popover id='buy-enabled-overlay-right'>
                                      <Popover.Content>
                                      如果启用，机器人将出售币当它检测到卖出信号时。
                                      如果如果禁用，则bot将不会出售币，但继续监测。
                                      什么时候市场不稳定，你可以禁用这是暂时的。
                                      </Popover.Content>
                                    </Popover>
                                  }>
                                  <Button
                                    variant='link'
                                    className='p-0 m-0 ml-1 text-info'>
                                    <i className='fas fa-question-circle fa-sm'></i>
                                  </Button>
                                </OverlayTrigger>
                              </Form.Check.Label>
                            </Form.Check>
                          </Form.Group>
                        </div>
                        <div className='col-12'>
                          <SymbolSettingIconGridSell
                            gridTrade={symbolConfiguration.sell.gridTrade}
                            quoteAsset={quoteAsset}
                            handleSetValidation={this.handleSetValidation}
                            handleGridTradeChange={this.handleGridTradeChange}
                          />
                        </div>
                        <div className='col-12'>
                          <Accordion defaultActiveKey='0'>
                            <Card className='mt-1'>
                              <Card.Header className='px-2 py-1'>
                                <Accordion.Toggle
                                  as={Button}
                                  variant='link'
                                  eventKey='0'
                                  className='p-0 fs-7 text-uppercase'>
                                  卖出止损设置
                                </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey='0'>
                                <Card.Body className='px-2 py-1'>
                                  <div className='row'>
                                    <div className='col-12'>
                                      <Form.Group
                                        controlId='field-sell-stop-loss-enabled'
                                        className='mb-2'>
                                        <Form.Check size='sm'>
                                          <Form.Check.Input
                                            type='checkbox'
                                            data-state-key='sell.stopLoss.enabled'
                                            checked={
                                              symbolConfiguration.sell.stopLoss
                                                .enabled
                                            }
                                            onChange={this.handleInputChange}
                                          />
                                          <Form.Check.Label>
                                            启用{' '}
                                            <OverlayTrigger
                                              trigger='click'
                                              key='sell-stop-loss-enabled-overlay'
                                              placement='bottom'
                                              overlay={
                                                <Popover id='sell-stop-loss-enabled-overlay-right'>
                                                  <Popover.Content>
                                                  如果启用，则在将到达已配置最后买入价的损失金额，把币卖掉。
                                                  你可以启用此功能可以防止损失超过预期。
                                                  </Popover.Content>
                                                </Popover>
                                              }>
                                              <Button
                                                variant='link'
                                                className='p-0 m-0 ml-1 text-info'>
                                                <i className='fas fa-question-circle fa-sm'></i>
                                              </Button>
                                            </OverlayTrigger>
                                          </Form.Check.Label>
                                        </Form.Check>
                                      </Form.Group>
                                    </div>
                                    <div className='col-xs-12 col-sm-6'>
                                      <Form.Group
                                        controlId='field-sell-stop-loss-max-loss-percentage'
                                        className='mb-2'>
                                        <Form.Label className='mb-0'>
                                          最大亏损率{' '}
                                          <OverlayTrigger
                                            trigger='click'
                                            key='sell-stop-loss-max-loss-percentage-overlay'
                                            placement='bottom'
                                            overlay={
                                              <Popover id='sell-stop-loss-max-loss-percentage-overlay-right'>
                                                <Popover.Content>
                                                  设置你能接受的最大亏损率，例如： 如果设置{' '}
                                                  <code>0.80</code>, 意味着你能最大接受{' '}
                                                  <code>-20%</code> 的亏损。当你在价格 <code>$100</code>时买入,
                                                  最后买入价为{' '}<code>$100</code>。 那么当价格达到{' '}
                                                  <code>$80</code>，机器人会挂一个{' '}
                                                  <strong>市价单</strong>{' '}
                                                  出售全部持有的币。
                                                </Popover.Content>
                                              </Popover>
                                            }>
                                            <Button
                                              variant='link'
                                              className='p-0 m-0 ml-1 text-info'>
                                              <i className='fas fa-question-circle fa-sm'></i>
                                            </Button>
                                          </OverlayTrigger>
                                        </Form.Label>
                                        <Form.Control
                                          size='sm'
                                          type='number'
                                          placeholder='Enter maximum loss percentage'
                                          required
                                          max='1'
                                          min='0'
                                          step='0.0001'
                                          data-state-key='sell.stopLoss.maxLossPercentage'
                                          value={
                                            symbolConfiguration.sell.stopLoss
                                              .maxLossPercentage
                                          }
                                          onChange={this.handleInputChange}
                                        />
                                      </Form.Group>
                                    </div>
                                    <div className='col-xs-12 col-sm-6'>
                                      <Form.Group
                                        controlId='field-sell-stop-loss-disable-buy-minutes'
                                        className='mb-2'>
                                        <Form.Label className='mb-0'>
                                        暂停买入时间(分钟){' '}
                                          <OverlayTrigger
                                            trigger='click'
                                            key='sell-stop-loss-disable-buy-minutes-overlay'
                                            placement='bottom'
                                            overlay={
                                              <Popover id='sell-stop-loss-disable-buy-minutes-overlay-right'>
                                                <Popover.Content>
                                                设置当触发止损后，暂停买入多长时间，相当于冷静期的意思。 例如：如果设置为<code>360</code>，机器人将暂时关闭，禁止购买6小时。
                                                </Popover.Content>
                                              </Popover>
                                            }>
                                            <Button
                                              variant='link'
                                              className='p-0 m-0 ml-1 text-info'>
                                              <i className='fas fa-question-circle fa-sm'></i>
                                            </Button>
                                          </OverlayTrigger>
                                        </Form.Label>
                                        <Form.Control
                                          size='sm'
                                          type='number'
                                          placeholder='Enter minutes for disabling buy'
                                          required
                                          max='99999999'
                                          min='1'
                                          step='1'
                                          data-state-key='sell.stopLoss.disableBuyMinutes'
                                          value={
                                            symbolConfiguration.sell.stopLoss
                                              .disableBuyMinutes
                                          }
                                          onChange={this.handleInputChange}
                                        />
                                      </Form.Group>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Accordion.Collapse>
                            </Card>
                          </Accordion>
                        </div>

                        <div className='col-12'>
                          <Accordion defaultActiveKey='0'>
                            <Card className='mt-1'>
                              <Card.Header className='px-2 py-1'>
                                <Accordion.Toggle
                                  as={Button}
                                  variant='link'
                                  eventKey='0'
                                  className='p-0 fs-7 text-uppercase'>
                                  TradingView
                                </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey='0'>
                                <Card.Body className='px-2 py-1'>
                                  <div className='row'>
                                    <div className='col-12'>
                                      <Form.Group
                                        controlId='field-sell-tradingview-force-sell-over-zero-below-trigger-price-when-neutral'
                                        className='mb-2'>
                                        <Form.Check size='sm'>
                                          <Form.Check.Input
                                            type='checkbox'
                                            data-state-key='sell.tradingView.forceSellOverZeroBelowTriggerPrice.whenNeutral'
                                            checked={
                                              symbolConfiguration.sell
                                                .tradingView
                                                .forceSellOverZeroBelowTriggerPrice
                                                .whenNeutral
                                            }
                                            onChange={this.handleInputChange}
                                          />
                                          <Form.Check.Label>
                                            当价格为{' '}<code>Neutral</code>时，强制以市价单卖出，
                                            利润在 <code>0</code> 到{' '}
                                            <code>触发价</code>之间{' '}
                                            <OverlayTrigger
                                              trigger='click'
                                              key='sell-tradingview-force-sell-over-zero-below-trigger-price-when-neutral-overlay'
                                              placement='bottom'
                                              overlay={
                                                <Popover id='sell-tradingview-force-sell-over-zero-below-trigger-price-when-neutral-overlay-right'>
                                                  <Popover.Content>
                                                  如果启用，则机器人会根据TradingView的建议，以市价单卖出。当利润超过0，但低于触发价格时。
                                                  当满足条件，且TradingView建议是“Neutral”时，那么机器人会立即下一个市价单卖出。
                                                  如果启用了自动购买触发器，那么它将稍后会出售购买订单。请注意，如果利润低于佣金，此动作可能会导致损失。
                                                  </Popover.Content>
                                                </Popover>
                                              }>
                                              <Button
                                                variant='link'
                                                className='p-0 m-0 ml-1 text-info'>
                                                <i className='fas fa-question-circle fa-sm'></i>
                                              </Button>
                                            </OverlayTrigger>
                                          </Form.Check.Label>
                                        </Form.Check>
                                      </Form.Group>
                                    </div>
                                    <div className='col-12'>
                                      <Form.Group
                                        controlId='field-sell-tradingview-force-sell-over-zero-below-trigger-price-when-sell'
                                        className='mb-2'>
                                        <Form.Check size='sm'>
                                          <Form.Check.Input
                                            type='checkbox'
                                            data-state-key='sell.tradingView.forceSellOverZeroBelowTriggerPrice.whenSell'
                                            checked={
                                              symbolConfiguration.sell
                                                .tradingView
                                                .forceSellOverZeroBelowTriggerPrice
                                                .whenSell
                                            }
                                            onChange={this.handleInputChange}
                                          />
                                          <Form.Check.Label>
                                            当建议是 <code>Sell</code>{' '}时，强制以市价单卖出，
                                            利润在{' '} <code>0</code> 到{' '} <code>触发价</code>之间{' '}
                                            <OverlayTrigger
                                              trigger='click'
                                              key='sell-tradingview-force-sell-over-zero-below-trigger-price-when-sell-overlay'
                                              placement='bottom'
                                              overlay={
                                                <Popover id='sell-tradingview-force-sell-over-zero-below-trigger-price-when-sell-overlay-right'>
                                                  <Popover.Content>
                                                  如果启用，则会使用TradingView建议，当利润超过0，但在触发价以下时，以市价单卖出。
                                                  当TradingView建议是“Sell”，那么机器人将立即放置市价单。
                                                  如果启用了自动购买触发器，那么它将稍后会出售购买订单。
                                                  请注意，如果利润低于佣金，此动作可能会导致损失。
                                                  </Popover.Content>
                                                </Popover>
                                              }>
                                              <Button
                                                variant='link'
                                                className='p-0 m-0 ml-1 text-info'>
                                                <i className='fas fa-question-circle fa-sm'></i>
                                              </Button>
                                            </OverlayTrigger>
                                          </Form.Check.Label>
                                        </Form.Check>
                                      </Form.Group>
                                    </div>
                                    <div className='col-12'>
                                      <Form.Group
                                        controlId='field-sell-tradingview-force-sell-over-zero-below-trigger-price-when-strong-sell'
                                        className='mb-2'>
                                        <Form.Check size='sm'>
                                          <Form.Check.Input
                                            type='checkbox'
                                            data-state-key='sell.tradingView.forceSellOverZeroBelowTriggerPrice.whenStrongSell'
                                            checked={
                                              symbolConfiguration.sell
                                                .tradingView
                                                .forceSellOverZeroBelowTriggerPrice
                                                .whenStrongSell
                                            }
                                            onChange={this.handleInputChange}
                                          />
                                          <Form.Check.Label>
                                          当建议是 <code>Strong sell</code>{' '}时，强制以市价单卖出，
                                          利润在{' '} <code>0</code> 到{' '} <code>触发价</code>之间{' '}
                                            <OverlayTrigger
                                              trigger='click'
                                              key='sell-tradingview-force-sell-over-zero-below-trigger-price-when-strong-sell-overlay'
                                              placement='bottom'
                                              overlay={
                                                <Popover id='sell-tradingview-force-sell-over-zero-below-trigger-price-when-strong-sell-overlay-right'>
                                                  <Popover.Content>
                                                  如果启用，则会使用TradingView建议，当利润超过0，但在触发价以下时，以市价单卖出。
                                                  当TradingView建议是“Strong sell”，那么机器人将立即放置市价单。
                                                  如果启用了自动购买触发器，那么它将稍后会出售购买订单。
                                                  请注意，如果利润低于佣金，此动作可能会导致损失。
                                                  </Popover.Content>
                                                </Popover>
                                              }>
                                              <Button
                                                variant='link'
                                                className='p-0 m-0 ml-1 text-info'>
                                                <i className='fas fa-question-circle fa-sm'></i>
                                              </Button>
                                            </OverlayTrigger>
                                          </Form.Check.Label>
                                        </Form.Check>
                                      </Form.Group>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Accordion.Collapse>
                            </Card>
                          </Accordion>
                        </div>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              <SymbolSettingIconBotOptions
                botOptions={symbolConfiguration.botOptions}
                handleBotOptionsChange={this.handleBotOptionsChange}
              />

              <Accordion defaultActiveKey='0'>
                <Card className='mt-1'>
                  <Card.Header className='px-2 py-1'>
                    <Accordion.Toggle
                      as={Button}
                      variant='link'
                      eventKey='0'
                      className='p-0 fs-7 text-uppercase'>
                      还原设置
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey='0'>
                    <Card.Body className='px-2 py-2'>
                      <div className='row'>
                        <div className='col-12'>
                          <Button
                            variant='danger'
                            size='sm'
                            type='button'
                            className='mr-2'
                            onClick={() => this.handleModalShow('confirm')}>
                            重置为全局设置
                          </Button>

                          <Button
                            variant='danger'
                            size='sm'
                            type='button'
                            onClick={() => this.handleModalShow('gridTrade')}>
                            重置订单参数
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Modal.Body>
            <Modal.Footer>
              <div className='w-100'>
              请注意，更改将会在下一个刷新间隔时，显示在前端。
              </div>

              <Button
                variant='secondary'
                size='sm'
                type='button'
                onClick={() => this.handleModalClose('setting')}>
                关闭
              </Button>
              <Button type='submit' variant='primary' size='sm'>
                保存设置
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        <Modal
          show={this.state.showConfirmModal}
          onHide={() => this.handleModalClose('confirm')}
          size='md'>
          <Modal.Header className='pt-1 pb-1'>
            <Modal.Title>
              <span className='text-danger'>⚠ 重置为全局设置</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            警告: 您将要将符号设置重置为全局设置。
            <br />
            <br />
            是否要清空当前的设置？
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => this.handleModalClose('confirm')}>
              取消
            </Button>
            <Button
              variant='success'
              size='sm'
              onClick={() => this.resetToGlobalConfiguration()}>
              确认
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.showResetGridTradeModal}
          onHide={() => this.handleModalClose('gridTrade')}
          size='md'>
          <Modal.Header className='pt-1 pb-1'>
            <Modal.Title>
              <span className='text-danger'>⚠ 重置订单参数</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            您将要重置现有的网格交易。如果网格交易已经执行，执行历史将被删除。
            <br />
            <br />
            是否要重置所选符号的网格交易历史记录？
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => this.handleModalClose('gridTrade')}>
              取消
            </Button>
            <Button
              variant='info'
              size='sm'
              onClick={() => this.resetGridTrade('archive')}>
              存档并删除
            </Button>
            <Button
              variant='danger'
              size='sm'
              onClick={() => this.resetGridTrade('delete')}>
              删除不存档
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
class SymbolSettingIconBotOptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      botOptions: {}
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidUpdate(nextProps) {
    // Only update configuration, when the modal is closed and different.
    if (
      _.isEmpty(nextProps.botOptions) === false &&
      _.isEqual(nextProps.botOptions, this.state.botOptions) === false
    ) {
      const { botOptions } = nextProps;

      this.setState({
        botOptions
      });
    }
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

    const { botOptions } = this.state;

    const newBotOptions = _.set(botOptions, stateKey, value);
    this.setState({
      botOptions: newBotOptions
    });

    this.props.handleBotOptionsChange(botOptions);
  }

  render() {
    const { botOptions } = this.state;

    if (_.isEmpty(botOptions)) {
      return '';
    }

    return (
      <Accordion defaultActiveKey='0'>
        <Card className='mt-1'>
          <Card.Header className='px-2 py-1'>
            <Accordion.Toggle
              as={Button}
              variant='link'
              eventKey='0'
              className='p-0 fs-7 text-uppercase'>
              机器人配置
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey='0'>
            <Card.Body className='px-2 py-1'>
              <div className='row'>
                <div className='col-12'>
                  <Accordion defaultActiveKey='0'>
                    <Card className='mt-1'>
                      <Card.Header className='px-2 py-1'>
                        <Accordion.Toggle
                          as={Button}
                          variant='link'
                          eventKey='0'
                          className='p-0 fs-7 text-uppercase'>
                          自动买入
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey='0'>
                        <Card.Body className='px-2 py-1'>
                          <div className='row'>
                            <div className='col-12'>
                              <Form.Group
                                controlId='field-bot-options-auto-trigger-buy-enabled'
                                className='mb-2'>
                                <Form.Check size='sm'>
                                  <Form.Check.Input
                                    type='checkbox'
                                    data-state-key='autoTriggerBuy.enabled'
                                    checked={botOptions.autoTriggerBuy.enabled}
                                    onChange={this.handleInputChange}
                                  />
                                  <Form.Check.Label>
                                    启用{' '}
                                    <OverlayTrigger
                                      trigger='click'
                                      key='bot-options-auto-trigger-buy-enabled-overlay'
                                      placement='bottom'
                                      overlay={
                                        <Popover id='bot-options-auto-trigger-buy-enabled-overlay-right'>
                                          <Popover.Content>
                                            If enabled, the bot will trigger 1st
                                            grid trade for buying after removing
                                            the last buy price due to completed
                                            grid trades for selling. Note that
                                            this action may be triggered if you
                                            sell the coin in Binance directly
                                            and the last buy price was recorded.
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
                              <div className='row'>
                                <div className='col-6'>
                                  <Form.Group
                                    controlId='field-bot-options-auto-trigger-buy-trigger-after'
                                    className='mb-2'>
                                    <Form.Label className='mb-0'>
                                      触发后时间
                                      <OverlayTrigger
                                        trigger='click'
                                        key='limit-overlay'
                                        placement='bottom'
                                        overlay={
                                          <Popover id='limit-overlay-right'>
                                            <Popover.Content>
                                              Set the minutes to wait for
                                              triggering the grid trade for
                                              buying. Once the time passes the
                                              configured minutes, the bot will
                                              trigger the grid trade for buying.
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
                                      placeholder='Enter minutes'
                                      required
                                      min='1'
                                      step='1'
                                      data-state-key='autoTriggerBuy.triggerAfter'
                                      value={
                                        botOptions.autoTriggerBuy.triggerAfter
                                      }
                                      onChange={this.handleInputChange}
                                    />
                                  </Form.Group>
                                </div>
                                <div className='col-12'>
                                  <strong>触发条件</strong>
                                </div>
                                <div className='col-6'>
                                  <Form.Group
                                    controlId='field-bot-options-auto-trigger-buy-condition-when-less-than-ath-restriction'
                                    className='mb-2'>
                                    <Form.Check size='sm'>
                                      <Form.Check.Input
                                        type='checkbox'
                                        data-state-key='autoTriggerBuy.conditions.whenLessThanATHRestriction'
                                        checked={
                                          botOptions.autoTriggerBuy.conditions
                                            .whenLessThanATHRestriction
                                        }
                                        onChange={this.handleInputChange}
                                      />
                                      <Form.Check.Label>
                                      当实时价格超过ATH限制时，重新安排{' '}
                                        <OverlayTrigger
                                          trigger='click'
                                          key='bot-options-auto-trigger-buy-conditions-when-less-than-ath-restriction-overlay'
                                          placement='bottom'
                                          overlay={
                                            <Popover id='bot-options-auto-trigger-buy-conditions-when-less-than-ath-restriction-overlay-right'>
                                              <Popover.Content>
                                                If enabled, the bot will
                                                re-schedule the auto-buy trigger
                                                action if the price is over the
                                                ATH restriction.
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
                                <div className='col-6'>
                                  <Form.Group
                                    controlId='field-bot-options-auto-trigger-buy-condition-after-disabled-period'
                                    className='mb-2'>
                                    <Form.Check size='sm'>
                                      <Form.Check.Input
                                        type='checkbox'
                                        data-state-key='autoTriggerBuy.conditions.afterDisabledPeriod'
                                        checked={
                                          botOptions.autoTriggerBuy.conditions
                                            .afterDisabledPeriod
                                        }
                                        onChange={this.handleInputChange}
                                      />
                                      <Form.Check.Label>
                                        当操作被禁用时，重新安排{' '}
                                        <OverlayTrigger
                                          trigger='click'
                                          key='bot-options-auto-trigger-buy-conditions-after-disabled-period-overlay'
                                          placement='bottom'
                                          overlay={
                                            <Popover id='bot-options-auto-trigger-buy-conditions-after-disabled-period-overlay-right'>
                                              <Popover.Content>
                                                If enabled, the bot will
                                                re-schedule the auto-buy trigger
                                                action if the action is
                                                currently disabled by the
                                                stop-loss or other actions.
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
                                  <strong>
                                    TradingView{' '}
                                    <OverlayTrigger
                                      trigger='click'
                                      key='bot-options-auto-trigger-buy-conditions-tradingview-when-strong-buy-overlay'
                                      placement='bottom'
                                      overlay={
                                        <Popover id='bot-options-auto-trigger-buy-conditions-tradingview-when-strong-buy-overlay-right'>
                                          <Popover.Content>
                                            TradingView is the service that
                                            provides technical analysis based on
                                            various indicators such as
                                            oscillators and moving averages. The
                                            bot is integrated with TradingView
                                            summary recommendation to control
                                            the auto-trigger buy action.
                                          </Popover.Content>
                                        </Popover>
                                      }>
                                      <Button
                                        variant='link'
                                        className='p-0 m-0 ml-1 text-info'>
                                        <i className='fas fa-question-circle fa-sm'></i>
                                      </Button>
                                    </OverlayTrigger>
                                  </strong>
                                </div>
                                <div className='col-6'>
                                  <Form.Group
                                    controlId='field-bot-options-auto-trigger-buy-condition-tradingview-when-strong-buy'
                                    className='mb-2'>
                                    <Form.Check size='sm'>
                                      <Form.Check.Input
                                        type='checkbox'
                                        data-state-key='autoTriggerBuy.conditions.tradingView.whenStrongBuy'
                                        checked={
                                          botOptions.autoTriggerBuy.conditions
                                            .tradingView.whenStrongBuy
                                        }
                                        onChange={this.handleInputChange}
                                      />
                                      <Form.Check.Label>
                                      当TradingView建议是{' '} <code>Strong buy</code>时允许{' '}
                                        <OverlayTrigger
                                          trigger='click'
                                          key='bot-options-auto-trigger-buy-conditions-tradingview-when-strong-buy-overlay'
                                          placement='bottom'
                                          overlay={
                                            <Popover id='bot-options-auto-trigger-buy-conditions-tradingview-when-strong-buy-overlay-right'>
                                              <Popover.Content>
                                                If enabled, the bot will trigger
                                                the auto-buy trigger action if
                                                the TradingView recommendation
                                                is `Strong buy`. If the
                                                recommendation is not `Strong
                                                buy`, then the bot will
                                                re-schedule the auto-buy trigger
                                                action.
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
                                <div className='col-6'>
                                  <Form.Group
                                    controlId='field-bot-options-auto-trigger-buy-condition-tradingview-when-buy'
                                    className='mb-2'>
                                    <Form.Check size='sm'>
                                      <Form.Check.Input
                                        type='checkbox'
                                        data-state-key='autoTriggerBuy.conditions.tradingView.whenBuy'
                                        checked={
                                          botOptions.autoTriggerBuy.conditions
                                            .tradingView.whenBuy
                                        }
                                        onChange={this.handleInputChange}
                                      />
                                      <Form.Check.Label>
                                      当TradingView建议是<code>Buy</code>时允许{' '}
                                        <OverlayTrigger
                                          trigger='click'
                                          key='bot-options-auto-trigger-buy-conditions-tradingview-when-buy-overlay'
                                          placement='bottom'
                                          overlay={
                                            <Popover id='bot-options-auto-trigger-buy-conditions-tradingview-when-buy-overlay-right'>
                                              <Popover.Content>
                                                If enabled, the bot will trigger
                                                the auto-buy trigger action if
                                                the TradingView recommendation
                                                is `Buy`. If the recommendation
                                                is not `Buy`, then the bot will
                                                re-schedule the auto-buy trigger
                                                action.
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
                          TradingView
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey='0'>
                        <Card.Body className='px-2 py-1'>
                          <div className='row'>
                            <div className='col-12 col-md-6'>
                              <Form.Group
                                controlId='field-bot-options-tradingview-interval'
                                className='mb-2'>
                                <Form.Label className='mb-0'>
                                  K线大小
                                  <OverlayTrigger
                                    trigger='click'
                                    key='bot-options-tradingview-intervaloverlay'
                                    placement='bottom'
                                    overlay={
                                      <Popover id='bot-options-tradingview-intervaloverlay-right'>
                                        <Popover.Content>
                                          Set TradingView candle interval. If
                                          empty, it will use candles -&gt;
                                          interval.
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
                                  data-state-key='tradingView.interval'
                                  value={botOptions.tradingView.interval}
                                  onChange={this.handleInputChange}>
                                  <option value=''>
                                    使用K线 -&gt; 间隔
                                  </option>
                                  <option value='1m'>1分钟</option>
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
                            <div className='col-12 col-md-6'>
                              <Form.Group
                                controlId='field-bot-options-tradingview-use-only-within'
                                className='mb-2'>
                                <Form.Label className='mb-0'>
                                  仅使用在此更新时间之内的建议
                                  <OverlayTrigger
                                    trigger='click'
                                    key='tradingview-use-only-within-overlay'
                                    placement='bottom'
                                    overlay={
                                      <Popover id='tradingview-use-only-within-overlay-right'>
                                        <Popover.Content>
                                          Set the minutes to allow to use
                                          TradingView technical analysis data.
                                          If the data is older than configured
                                          minutes, the bot will ignore the
                                          TradingView technical analysis data.
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

                                <InputGroup size='sm'>
                                  <Form.Control
                                    type='number'
                                    placeholder='Enter minutes'
                                    required
                                    min='1'
                                    step='1'
                                    data-state-key='tradingView.useOnlyWithin'
                                    value={botOptions.tradingView.useOnlyWithin}
                                    onChange={this.handleInputChange}
                                  />
                                  <InputGroup.Append>
                                    <InputGroup.Text>分钟</InputGroup.Text>
                                  </InputGroup.Append>
                                </InputGroup>
                              </Form.Group>
                            </div>
                            <div className='col-12 col-md-6'>
                              <Form.Group
                                controlId='field-bot-options-tradingview-if-expires'
                                className='mb-2'>
                                <Form.Label className='mb-0'>
                                  如果数据已过期，怎么处理
                                  <OverlayTrigger
                                    trigger='click'
                                    key='bot-options-tradingview-if-expires-overlay'
                                    placement='bottom'
                                    overlay={
                                      <Popover id='bot-options-tradingview-if-expires-overlay-right'>
                                        <Popover.Content>
                                          Set an action method if the
                                          TradingView technical analysis data is
                                          passed allowed minutes.
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
                                  data-state-key='tradingView.ifExpires'
                                  value={botOptions.tradingView.ifExpires}
                                  onChange={this.handleInputChange}>
                                  <option value='ignore'>忽略数据</option>
                                  <option value='do-not-buy'>不要买</option>
                                </Form.Control>
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
    );
  }
}

/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
class SymbolSettingIconGridBuy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gridTrade: [],
      validation: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);

    this.onAddGridTrade = this.onAddGridTrade.bind(this);
    this.onRemoveGridTrade = this.onRemoveGridTrade.bind(this);
    this.validateGridTrade = this.validateGridTrade.bind(this);
  }

  componentDidUpdate(nextProps) {
    // Only update configuration, when the modal is closed and different.
    if (
      _.isEmpty(nextProps.gridTrade) === false &&
      _.isEqual(nextProps.gridTrade, this.state.gridTrade) === false
    ) {
      const { gridTrade } = nextProps;

      this.setState({
        gridTrade
      });
      this.validateGridTrade(gridTrade);
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

    const { gridTrade } = this.state;

    const newGridTrade = _.set(gridTrade, stateKey, value);

    this.setState({
      gridTrade: newGridTrade
    });
    this.validateGridTrade(newGridTrade);

    this.props.handleGridTradeChange('buy', newGridTrade);
  }

  onAddGridTrade(_event) {
    const { minNotional } = this.props;
    const { gridTrade } = this.state;
    const lastGridTrade = _.cloneDeep(_.last(gridTrade));
    let newGridTrade;
    if (lastGridTrade) {
      lastGridTrade.executed = false;
      lastGridTrade.executedOrder = null;

      // If the grid trade has existing grid data, then use the last row to create new grid trade.
      newGridTrade = _.concat(gridTrade, lastGridTrade);
    } else {
      newGridTrade = _.concat(gridTrade, {
        triggerPercentage: gridTrade.length === 0 ? 1 : 0.8,
        stopPercentage: 1.03,
        limitPercentage: 1.031,
        minPurchaseAmount: minNotional,
        maxPurchaseAmount: minNotional
      });
    }

    this.setState({
      gridTrade: newGridTrade
    });

    this.validateGridTrade(newGridTrade);
    this.props.handleGridTradeChange('buy', newGridTrade);
  }

  onRemoveGridTrade(index) {
    const { gridTrade } = this.state;

    _.pullAt(gridTrade, index);

    this.setState({
      gridTrade
    });
    this.validateGridTrade(gridTrade);
    this.props.handleGridTradeChange('buy', gridTrade);
  }

  /**
   * Validate grid trade for buying
   *
   *  - Only 1st trigger percentage can be above or equal to 1.
   *  - The stop price percentage cannot be higher than the stop price percentage.
   *  - Buy amount cannot be less than the minimum notional value.
   */
  validateGridTrade(gridTrade) {
    const { minNotional, quoteAsset } = this.props;

    const validation = [];

    let isValid = true;

    gridTrade.forEach((grid, index) => {
      const v = {
        messages: [],
        triggerPercentage: true,
        stopPercentage: true,
        limitPercentage: true,
        minPurchaseAmount: true,
        maxPurchaseAmount: true
      };

      const humanisedIndex = index + 1;

      if (index === 0 && grid.triggerPercentage < 1) {
        // If it is the first grid trade and the trigger percentage is less than 1,
        isValid = false;
        v.triggerPercentage = false;
        v.messages.push(
          `The trigger percentage for Grid #${humanisedIndex} cannot be less than 1.`
        );
      } else if (index !== 0 && grid.triggerPercentage >= 1) {
        // If it is not the first grid trade and the trigger percentage is more than 1,
        isValid = false;
        v.triggerPercentage = false;
        v.messages.push(
          `The trigger percentage for Grid #${humanisedIndex} cannot be equal or above 1.`
        );
      }

      // If the stop price percentage cannot be higher than the stop price percentage.
      if (grid.stopPercentage >= grid.limitPercentage) {
        isValid = false;
        v.limitPercentage = false;
        v.messages.push(
          `The stop price percentage cannot be equal or over the limit percentage.`
        );
      }

      // If the min purchase amount is less than the minimum notional value,
      if (parseFloat(grid.minPurchaseAmount) < parseFloat(minNotional)) {
        isValid = false;
        v.minPurchaseAmount = false;
        v.messages.push(
          `The min purchase amount for ${quoteAsset} cannot be less than the minimum notional value ${minNotional}.`
        );
      }

      // If the max purchase amount is less than the minimum notional value,
      if (parseFloat(grid.maxPurchaseAmount) < parseFloat(minNotional)) {
        isValid = false;
        v.maxPurchaseAmount = false;
        v.messages.push(
          `The max purchase amount for ${quoteAsset} cannot be less than the minimum notional value ${minNotional}.`
        );
      }

      // If maximum purchase amount is less than minimum purchase amount,
      if (
        parseFloat(grid.minPurchaseAmount) > parseFloat(grid.maxPurchaseAmount)
      ) {
        isValid = false;
        v.maxPurchaseAmount = false;
        v.messages.push(
          `The max purchase amount for ${quoteAsset} cannot be less than the minimum purchase amount ${grid.minPurchaseAmount}.`
        );
      }

      validation.push(v);
    });

    this.setState({
      validation
    });
    this.props.handleSetValidation('gridBuy', isValid);
  }

  render() {
    const { quoteAsset } = this.props;
    const { gridTrade, validation } = this.state;

    const gridRows = gridTrade.map((grid, i) => {
      const validationText = _.get(validation, `${i}.messages`, []).reduce(
        (acc, message, k) => [
          ...acc,
          <div
            key={'error-message-' + i + '-' + k}
            className='field-error-message text-danger'>
            <i className='fas fa-exclamation-circle mx-1'></i>
            {message}
          </div>
        ],
        []
      );

      return (
        <React.Fragment key={'grid-row-buy-' + i}>
          <tr>
            <td className='align-middle font-weight-bold' width='90%'>
              买单 #{i + 1}
            </td>
            <td className='align-middle text-center'>
              {i !== 0 && grid.executed !== true ? (
                <button
                  type='button'
                  className='btn btn-sm btn-link p-0'
                  onClick={() => this.onRemoveGridTrade(i)}>
                  <i className='fas fa-times-circle text-danger'></i>
                </button>
              ) : (
                ''
              )}
            </td>
          </tr>
          <tr>
            <td colSpan='2'>
              <div className='row'>
                <div className='col-xs-12 col-sm-6'>
                  <Form.Group
                    controlId={'field-grid-buy-' + i + '-trigger-percentage'}
                    className='mb-2'>
                    <Form.Label className='mb-0'>
                      触底价{'(%)'}{' '}
                      <strong>
                        {i === 0
                          ? `基于最低价`
                          : `基于最后买入价`}
                      </strong>{' '}
                      <OverlayTrigger
                        trigger='click'
                        key={
                          'field-grid-buy-' + i + '-trigger-percentage-overlay'
                        }
                        placement='bottom'
                        overlay={
                          <Popover
                            id={
                              'field-grid-buy-' +
                              i +
                              '-trigger-percentage-overlay-right'
                            }>
                            <Popover.Content>
                              {i === 0 ? (
                                <React.Fragment>
                                  <strong>触底价:</strong>当{' '}<code>现价</code>{' '}达到此价格，机器人会挂一个[限价委托订单]买入，说明你认为这个价格是好的买入时机。
                                  <br />
                                  <br />
                                  <strong>触发价:</strong>当{' '}<code>现价</code>{' '}达到{' '}<code>触发价</code>{' '}时，[限价委托订单]将会自动激活生效。
                                  <br />
                                  <br />
                                  <strong>委托价:</strong>当{' '}<code>触发价</code>{' '}被激活以后，而且{' '}<code>现价</code>{' '}达到{' '}<code>委托价</code>{' '}，那么订单会立即成交。
                                  <br />
                                  <br />
                                  <strong>例如:</strong>
                                  <br />
                                  最低价:{' '}<code>$500</code>；
                                  <br />
                                  触底价:{' '}<code>$500*1.01=$505</code>；
                                  <br />
                                  触发价:{' '}<code>$500*1.02=$510</code>；
                                  <br />
                                  委托价:{' '}<code>$500*1.019=$509.5</code>；
                                  <br />
                                  当{' '}<code>现价</code>{' '}{'>'}{' '}<code>触底价:$505</code>{' '}时，等待。
                                  <br />
                                  当{' '}<code>现价</code>{' '}{'≦'}{' '}<code>触底价:$505</code>{' '}时，挂单。
                                  <br />
                                  {'▼ 此时跌破最低价：开新单 ▼'}
                                  <br />
                                  最低价:{' '}<code>$450</code>；
                                  <br />
                                  触底价:{' '}<code>$450*1.01=$454.5</code>；
                                  <br />
                                  触发价:{' '}<code>$450*1.02=$459</code>；
                                  <br />
                                  委托价:{' '}<code>$450*1.019=$458.55</code>；
                                  <br />
                                  {'▲ 此时开始上涨 ▲'}
                                  <br />
                                  当{' '}<code>现价</code>{' '}{'≧'}{' '}<code>触底价:$454.5</code>{' '}时，挂单。
                                  <br />
                                  当{' '}<code>现价</code>{' '}{'≧'}{' '}<code>触发价:$459</code>{' '}时，激活。
                                  <br />
                                  当{' '}<code>现价</code>{' '}{'='}{' '}<code>委托价:$458.55</code>{' '}时，成交。
                                  <br />
                                  <br />
                                  注意：触发系数不能小于1，不然可能永远无法触发，除非市场突然大幅度暴跌。
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
                                  根据上次购买价格，设置购买的触发百分比。
                                  例如-如何设置为{' '}<code>0.8</code>
                                  最后买入价是{' '}<code>$100</code>,
                                  当现价到达{' '}<code>$80</code>时会买入. 你不能设置大于1.
                                </React.Fragment>
                              )}
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
                      placeholder='Enter trigger percentage'
                      required
                      min={i === 0 ? '1' : '0'}
                      max={i === 0 ? '1.9999' : '0.9999'}
                      step='0.0001'
                      isInvalid={
                        _.get(validation, `${i}.triggerPercentage`, true) ===
                        false
                      }
                      disabled={grid.executed}
                      data-state-key={`${i}.triggerPercentage`}
                      value={grid.triggerPercentage}
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                </div>
                <div className='col-xs-12 col-sm-6'>
                  <Form.Group
                    controlId={'field-grid-buy-' + i + '-stop-percentage'}
                    className='mb-2'>
                    <Form.Label className='mb-0'>
                      触发价{'(%)'}{' '}
                      <OverlayTrigger
                        trigger='click'
                        key={
                          'field-grid-buy-' +
                          i +
                          '-stop-price-percentage-overlay'
                        }
                        placement='bottom'
                        overlay={
                          <Popover
                            id={
                              'field-grid-buy-' +
                              i +
                              '-stop-price-percentage-overlay-right'
                            }>
                            <Popover.Content>
                              <strong>触发价:</strong>{' '}<code>触发价</code>{' '}是基于区间最低价计算出来的。当{' '}<code>现价</code>{' '}达到{' '}<code>触发价</code>{' '}时，[限价委托订单]将会自动激活生效。
                              <br />
                              一般{' '}<code>触发价</code>{' '}要设置大于{' '}<code>触底价</code>{' '}，如果{' '}<code>现价</code>{' '}持续下跌，这样不容易触发交易，才有抄底的效果。
                              <br />
                              <strong>例如:</strong>
                              <br />
                              最低价:{' '}<code>$100</code>
                              <br />
                              系数:{' '}<code>1.01</code>
                              <br />
                              触发价:{' '}<code>$100*1.01=$101</code>
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
                      placeholder='Enter stop price percentage'
                      required
                      min='0'
                      step='0.0001'
                      isInvalid={
                        _.get(validation, `${i}.stopPercentage`, true) === false
                      }
                      disabled={grid.executed}
                      data-state-key={`${i}.stopPercentage`}
                      value={grid.stopPercentage}
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                </div>
                <div className='col-xs-12 col-sm-6'>
                  <Form.Group
                    controlId={'field-grid-buy-' + i + '-limit-percentage'}
                    className='mb-2'>
                    <Form.Label className='mb-0'>
                      委托价{'(%)'}{' '}
                      <OverlayTrigger
                        trigger='click'
                        key={
                          'field-grid-buy-' + i + '-limit-percentage-overlay'
                        }
                        placement='bottom'
                        overlay={
                          <Popover
                            id={
                              'field-grid-buy-' +
                              i +
                              '-limit-percentage-overlay-right'
                            }>
                            <Popover.Content>
                              Set the percentage to calculate limit price. i.e.
                              if set <code>1.011</code> and current price{' '}
                              <code>$100</code>, limit price will be{' '}
                              <code>$101.10</code> for stop limit order.
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
                      placeholder='Enter limit price percentage'
                      required
                      min='0'
                      step='0.0001'
                      isInvalid={
                        _.get(validation, `${i}.limitPercentage`, true) ===
                        false
                      }
                      disabled={grid.executed}
                      data-state-key={`${i}.limitPercentage`}
                      value={grid.limitPercentage}
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                </div>
                <div className='col-xs-12 col-sm-6'>
                  <Form.Group
                    controlId={'field-grid-buy-' + i + '-min-purchase-amount'}
                    className='mb-2'>
                    <Form.Label className='mb-0'>
                      最小买入金额{' '}
                      <OverlayTrigger
                        trigger='click'
                        key={
                          'field-grid-buy-' + i + '-min-purchase-amount-overlay'
                        }
                        placement='bottom'
                        overlay={
                          <Popover
                            id={
                              'field-grid-buy-' +
                              i +
                              '-min-purchase-amount-overlay-right'
                            }>
                            <Popover.Content>
                              Set min purchase amount for symbols with quote
                              asset "{quoteAsset}". The min purchase amount will
                              be applied to the symbols which ends with "
                              {quoteAsset}" if not configured the symbol
                              configuration.
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
                      placeholder={'Enter min purchase amount'}
                      required
                      min='0'
                      step='0.0001'
                      isInvalid={
                        _.get(validation, `${i}.minPurchaseAmount`, true) ===
                        false
                      }
                      disabled={grid.executed}
                      data-state-key={`${i}.minPurchaseAmount`}
                      value={grid.minPurchaseAmount}
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                </div>
                <div className='col-xs-12 col-sm-6'>
                  <Form.Group
                    controlId={'field-grid-buy-' + i + '-max-purchase-amount'}
                    className='mb-2'>
                    <Form.Label className='mb-0'>
                      最大买入金额{' '}
                      <OverlayTrigger
                        trigger='click'
                        key={
                          'field-grid-buy-' + i + '-max-purchase-amount-overlay'
                        }
                        placement='bottom'
                        overlay={
                          <Popover
                            id={
                              'field-grid-buy-' +
                              i +
                              '-max-purchase-amount-overlay-right'
                            }>
                            <Popover.Content>
                              Set max purchase amount for symbols with quote
                              asset "{quoteAsset}". The max purchase amount will
                              be applied to the symbols which ends with "
                              {quoteAsset}" if not configured the symbol
                              configuration.
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
                      placeholder={'Enter max purchase amount'}
                      required
                      min='0'
                      step='0.0001'
                      isInvalid={
                        _.get(validation, `${i}.maxPurchaseAmount`, true) ===
                        false
                      }
                      disabled={grid.executed}
                      data-state-key={`${i}.maxPurchaseAmount`}
                      value={grid.maxPurchaseAmount}
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                </div>
                {validationText !== '' ? (
                  <div className='col-12'>{validationText}</div>
                ) : (
                  ''
                )}
              </div>
            </td>
          </tr>
        </React.Fragment>
      );
    });

    return (
      <div className='coin-info-grid-trade-wrapper coin-info-grid-trade-buy-wrapper'>
        <Table striped bordered hover size='sm'>
          <tbody>{gridRows}</tbody>
        </Table>
        <div className='row'>
          <div className='col-12 text-right'>
            <button
              type='button'
              className='btn btn-sm btn-add-new-grid-trade-buy'
              onClick={this.onAddGridTrade}>
              添加新的买单
            </button>
          </div>
        </div>
      </div>
    );
  }
}

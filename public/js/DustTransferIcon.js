/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */

class DustTransferIcon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      loading: false,
      dustTransfer: {}
    };

    this.handleModalShow = this.handleModalShow.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.executeDustTransfer = this.executeDustTransfer.bind(this);
  }

  componentDidUpdate(nextProps) {
    const { dustTransfer } = this.state;
    // Update dustTransfer
    if (
      _.get(nextProps, 'dustTransfer', null) !== null &&
      _.isEqual(_.get(nextProps, 'dustTransfer', null), dustTransfer) === false
    ) {
      const newDustTransfer = nextProps.dustTransfer.map(s => {
        s.checked = true;
        return s;
      });

      this.setState({ loading: false, dustTransfer: newDustTransfer });
    }
  }

  handleModalShow() {
    this.setState({
      showModal: true,
      loading: true,
      dustTransfer: {}
    });

    this.props.sendWebSocket('dust-transfer-get', {});
  }

  handleModalClose() {
    this.setState({
      showModal: false
    });
  }

  handleCheckboxChange(event) {
    const assetKey = event.target.getAttribute('data-state-asset');
    const { dustTransfer } = this.state;

    const newDustTransfer = dustTransfer.map((s, _index) => {
      if (assetKey === s.asset) {
        s.checked = !s.checked;
      }

      return s;
    });

    this.setState({
      dustTransfer: newDustTransfer
    });
  }

  executeDustTransfer() {
    const { dustTransfer } = this.state;

    this.handleModalClose();
    this.props.sendWebSocket('dust-transfer-execute', {
      dustTransfer
    });
  }

  render() {
    const { isAuthenticated } = this.props;
    const { showModal, loading, dustTransfer } = this.state;

    if (isAuthenticated === false) {
      return '';
    }

    let symbols = null;
    if (_.isEmpty(dustTransfer) === false) {
      symbols = dustTransfer.map((s, _index) => {
        return (
          <Form.Check
            key={`symbol-${s.asset}`}
            type='checkbox'
            id={`symbol-${s.asset}`}
            label={s.asset}
            defaultChecked={s.checked}
            data-state-asset={s.asset}
            onChange={this.handleCheckboxChange}
            className='checkbox-dust-transfer-symbol w-20'
          />
        );
      });
    }

    return (
      <div className='dust-transfer-wrapper'>
        <div className='dust-transfer-column'>
          <button
            type='button'
            className='btn btn-sm btn-link btn-dust-transfer'
            onClick={() => this.handleModalShow()}>
            小额资产兑换成BNB
          </button>
        </div>
        <Modal
          show={showModal}
          onHide={() => this.handleModalClose()}
          backdrop='static'
          size='xl'>
          <Modal.Header closeButton className='pt-1 pb-1'>
            <Modal.Title>小额资产兑换成BNB</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className='d-block text-muted mb-2'>
            您可以将估值低于0.001BTC的余额转换为BNB每6小时一次。目前无法转换退市的硬币。
            </p>
            <div className='dust-transfer-symbols-parent-wrappers'>
              {loading ? (
                <div className='text-center w-100'>
                  <Spinner animation='border' role='status'>
                    <span className='sr-only'>兑换中...</span>
                  </Spinner>
                </div>
              ) : (
                <div className='dust-transfer-symbols-wrappers'>
                  {_.isEmpty(symbols) ? (
                    <div className='text-center'>
                      没有可兑换的资产
                    </div>
                  ) : (
                    <React.Fragment>
                      <div className='dust-transfer-symbols-wrapper d-flex flex-row  flex-wrap justify-content-start mb-1'>
                        {symbols}
                      </div>
                      <div className='dust-transfer-button-wrapper'>
                        <button
                          type='button'
                          className='btn btn-sm btn-primary w-100 btn-dust-transfer-execute'
                          onClick={() => this.executeDustTransfer()}>
                          立即兑换
                        </button>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

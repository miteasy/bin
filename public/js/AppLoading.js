/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
class AppLoading extends React.Component {
  componentDidMount() {
    document.body.classList.add('app-locked');
  }

  componentWillUnmount() {
    document.body.classList.remove('app-locked');
  }

  render() {
    return (
      <div className='app-lock-screen flex-column d-flex h-100 justify-content-center align-content-center'>
        <div className='lock-screen-wrapper w-100 text-center'>
          <h1 className='app-h1 my-2'>
            <img
              src='./img/binance.png'
              className='binance-img'
              alt='Binance logo'
            />{' '}
            涨停宝-币安智能交易机器人
          </h1>
          <Spinner animation='border' role='status'>
            <span className='sr-only'>正在启动...</span>
          </Spinner>
        </div>
      </div>
    );
  }
}

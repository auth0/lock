import React from 'react';
import InputWrap from './input_wrap';

const InputIconSvg = (
  <svg
    className="auth0-lock-icon auth0-lock-icon-box"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="icon/key">
      <path
        id="Shape"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.3884 11.0145C14.4508 12.9522 11.3948 13.0447 9.32094 11.3401L7.20872 13.2642L9.60904 15.6697L8.83354 16.4466L6.39631 14.0048L4.88251 15.3832L7.39496 17.89L6.61586 18.6666L3.5 15.5587L3.53914 15.5198C3.47446 15.3363 3.51554 15.1287 3.67514 14.983L8.54211 10.5496C6.89425 8.47691 7.005 5.46384 8.92209 3.54636C10.9841 1.48455 14.3267 1.48455 16.3884 3.54636C18.4501 5.60846 18.4501 8.95239 16.3884 11.0145ZM15.6048 4.33856C13.98 2.71309 11.3454 2.71309 9.72062 4.33856C8.0958 5.9632 8.0958 8.59793 9.72062 10.2226C11.3454 11.8478 13.98 11.8478 15.6048 10.2226C17.2297 8.59793 17.2297 5.96292 15.6048 4.33856Z"
        fill="#888888"
      />
    </g>
  </svg>
);

const RefreshIconSvg = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.5496 8.77262C17.007 5.01122 13.8021 2.11002 9.88989 2.11002C6.79596 2.11002 4.14611 3.93257 2.896 6.55065H7.11154C7.41852 6.55065 7.66749 6.79935 7.66749 7.10579C7.66749 7.41251 7.41879 7.66205 7.11154 7.66205H2.47938H1.30282C1.30781 7.64318 1.3092 7.62291 1.3142 7.60404C1.23426 7.56296 1.16987 7.50217 1.11824 7.42889C1.10325 7.40918 1.09048 7.39086 1.07827 7.36977C1.04746 7.3112 1.02998 7.24791 1.02193 7.17935C1.01776 7.15326 1 7.133 1 7.10552C1 7.08997 1.00722 7.0772 1.00888 7.06166V1.5582C1.00888 1.25176 1.25757 1.0025 1.56427 1.0025C1.87125 1.0025 2.11994 1.25148 2.11994 1.5582V5.61994C3.6293 2.87224 6.53311 1 9.88989 1C14.4182 1 18.1481 4.39195 18.6951 8.77235H17.5496V8.77262ZM9.88989 17.655C12.9841 17.655 15.6337 15.833 16.8841 13.2152H12.6685C12.3615 13.2152 12.1128 12.967 12.1128 12.6595C12.1128 12.3525 12.3615 12.1043 12.6685 12.1043H17.3004C17.3004 12.1041 17.3007 12.1035 17.3007 12.1032H18.4775C18.4725 12.1221 18.4709 12.1424 18.4659 12.161C18.5461 12.2021 18.6105 12.2631 18.6621 12.3367C18.6774 12.3564 18.6893 12.3744 18.7018 12.3955C18.7326 12.4541 18.7504 12.5174 18.7584 12.5859C18.7626 12.612 18.7803 12.632 18.7803 12.6598C18.7803 12.675 18.7728 12.6881 18.7717 12.7031V18.2076C18.7717 18.5144 18.523 18.7628 18.2161 18.7628C17.9091 18.7628 17.6604 18.5144 17.6604 18.2076V14.1451C16.151 16.8928 13.2469 18.765 9.89017 18.765C5.36209 18.765 1.63255 15.3739 1.08493 10.9935H2.23041C2.77331 14.7549 5.97799 17.655 9.88989 17.655Z"
      fill="black"
    />
    <mask
      id="mask0"
      mask-type="alpha"
      maskUnits="userSpaceOnUse"
      x="1"
      y="1"
      width="18"
      height="18"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5496 8.77262C17.007 5.01122 13.8021 2.11002 9.88989 2.11002C6.79596 2.11002 4.14611 3.93257 2.896 6.55065H7.11154C7.41852 6.55065 7.66749 6.79935 7.66749 7.10579C7.66749 7.41251 7.41879 7.66205 7.11154 7.66205H2.47938H1.30282C1.30781 7.64318 1.3092 7.62291 1.3142 7.60404C1.23426 7.56296 1.16987 7.50217 1.11824 7.42889C1.10325 7.40918 1.09048 7.39086 1.07827 7.36977C1.04746 7.3112 1.02998 7.24791 1.02193 7.17935C1.01776 7.15326 1 7.133 1 7.10552C1 7.08997 1.00722 7.0772 1.00888 7.06166V1.5582C1.00888 1.25176 1.25757 1.0025 1.56427 1.0025C1.87125 1.0025 2.11994 1.25148 2.11994 1.5582V5.61994C3.6293 2.87224 6.53311 1 9.88989 1C14.4182 1 18.1481 4.39195 18.6951 8.77235H17.5496V8.77262ZM9.88989 17.655C12.9841 17.655 15.6337 15.833 16.8841 13.2152H12.6685C12.3615 13.2152 12.1128 12.967 12.1128 12.6595C12.1128 12.3525 12.3615 12.1043 12.6685 12.1043H17.3004C17.3004 12.1041 17.3007 12.1035 17.3007 12.1032H18.4775C18.4725 12.1221 18.4709 12.1424 18.4659 12.161C18.5461 12.2021 18.6105 12.2631 18.6621 12.3367C18.6774 12.3564 18.6893 12.3744 18.7018 12.3955C18.7326 12.4541 18.7504 12.5174 18.7584 12.5859C18.7626 12.612 18.7803 12.632 18.7803 12.6598C18.7803 12.675 18.7728 12.6881 18.7717 12.7031V18.2076C18.7717 18.5144 18.523 18.7628 18.2161 18.7628C17.9091 18.7628 17.6604 18.5144 17.6604 18.2076V14.1451C16.151 16.8928 13.2469 18.765 9.89017 18.765C5.36209 18.765 1.63255 15.3739 1.08493 10.9935H2.23041C2.77331 14.7549 5.97799 17.655 9.88989 17.655Z"
        fill="white"
      />
    </mask>
    <g mask="url(#mask0)"></g>
  </svg>
);

export default class CaptchaInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { isValid, value, image, placeholder } = this.props;
    const { focused } = this.state;

    return (
      isValid != nextProps.isValid ||
      value != nextProps.value ||
      focused != nextState.focused ||
      image != nextState.image ||
      placeholder != nextState.placeholder
    );
  }

  render() {
    const {
      lockId,
      image,
      value,
      placeholder,
      onReload,
      invalidHint,
      isValid,
      ...props
    } = this.props;
    const { focused } = this.state;

    return (
      <div>
        <div className="auth0-lock-captcha">
          <div
            className="auth0-lock-captcha-image"
            style={{ backgroundImage: `url(${image})` }}
          ></div>
          <button
            type="button"
            onClick={::this.handleReload}
            className="auth0-lock-captcha-refresh"
          >
            <RefreshIconSvg />
          </button>
        </div>
        <InputWrap
          focused={focused}
          invalidHint=""
          isValid={isValid}
          name="captcha"
          icon={InputIconSvg}
        >
          <input
            id={`${lockId}-captcha`}
            ref="input"
            type="text"
            inputMode="text"
            name="captcha"
            className="auth0-lock-input"
            placeholder={placeholder}
            autoComplete="off"
            autoCapitalize="off"
            onChange={::this.handleOnChange}
            onFocus={::this.handleFocus}
            onBlur={::this.handleBlur}
            aria-label="Email"
            aria-invalid={!isValid}
            aria-describedby={!isValid && invalidHint ? `auth0-lock-error-msg-email` : undefined}
            value={value}
            {...props}
          />
        </InputWrap>
      </div>
    );
  }

  handleOnChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleReload(e) {
    if (this.props.onReload) {
      e.preventDefault();
      this.props.onReload(e);
    }
  }

  handleFocus() {
    this.setState({ focused: true });
  }

  handleBlur() {
    this.setState({ focused: false });
  }
}

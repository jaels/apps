// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import store from 'store';

import { accountKey } from '@polkadot/ui-keyring/defaults';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import Balance from '@polkadot/ui-react-rx/Balance';
import Nonce from '@polkadot/ui-react-rx/Nonce';
import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';
import isUndefined from '@polkadot/util/is/undefined';

import classes from './util/classes';
import showUploadButton from './util/showUploadButton';
import showUploadAndDownloadButtons from './util/showUploadAndDownloadButtons';
import CopyButton from './CopyButton';
import translate from './translate';

type Props = I18nProps & {
  children?: React.ReactNode,
  hideAllFileIcons?: boolean,
  handleChangeAccount?: any,
  name?: string,
  value: string,
  withBalance?: boolean,
  withNonce?: boolean
};

type State = {
  address: string,
  hideAllFileIcons: boolean,
  isValid: boolean,
  publicKey: Uint8Array | null,
  shortValue: string
};

const DEFAULT_ADDR = '5'.padEnd(16, 'x');
const DEFAULT_SHORT = `${DEFAULT_ADDR.slice(0, 7)}…${DEFAULT_ADDR.slice(-7)}`;

class AddressSummary extends React.PureComponent<Props, State> {
  state: State = {} as State;

  static getDerivedStateFromProps ({ value, hideAllFileIcons }: Props, { address, publicKey, shortValue }: State): State {
    try {
      hideAllFileIcons = hideAllFileIcons;
      publicKey = addressDecode(value);
      address = addressEncode(publicKey);
      shortValue = `${address.slice(0, 7)}…${address.slice(-7)}`;
    } catch (error) {
      publicKey = null;
    }

    const isValid = !!publicKey && publicKey.length === 32;

    return {
      address: isValid ? address : DEFAULT_ADDR,
      hideAllFileIcons: hideAllFileIcons ? hideAllFileIcons : false,
      isValid,
      publicKey,
      shortValue: isValid ? shortValue : DEFAULT_SHORT
    };
  }

  render () {
    const { children, className, handleChangeAccount, name, style } = this.props;
    const { address, hideAllFileIcons, isValid, shortValue } = this.state;

    const isAccountAlreadySaved = () => {
      const localStorageAccountKey = accountKey(address);

      try {
        const localStorageAccountValue = store.get(localStorageAccountKey);

        return isUndefined(localStorageAccountValue) ? false : true;
      } catch (e) {
        console.error('Error finding account from local storage: ', e);
      }

      return false;
    };

    return (
      <div
        className={classes('ui--AddressSummary', !isValid && 'invalid', className)}
        style={style}
      >
        <div className='ui--AddressSummary-base'>
          <IdentityIcon
            className='ui--AddressSummary-icon'
            size={96}
            value={address}
          />
          <div className='ui--AddressSummary-data'>
            <div className='ui--AddressSummary-name'>
              {name}
            </div>
            <div className='ui--AddressSummary-address'>
              {shortValue}
            </div>
            <CopyButton value={address} />
            {
              hideAllFileIcons ? (
                null
              ) : (
                isValid && isAccountAlreadySaved() ? (
                  showUploadAndDownloadButtons(address, handleChangeAccount)
                ) : (
                  showUploadButton(undefined, handleChangeAccount)
                )
              )
            }
          </div>
          {this.renderBalance()}
        </div>
        <div className='ui--AddressSummary-children'>
          {children}
        </div>
      </div>
    );
  }

  renderBalance () {
    const { isValid, publicKey } = this.state;

    if (!isValid) {
      return null;
    }

    const { t, withBalance = true, withNonce = true } = this.props;

    return [
      withBalance
        ? (
          <Balance
            className='ui--AddressSummary-balance'
            key='balance'
            label={t('addressSummary.balance', {
              defaultValue: 'balance '
            })}
            params={publicKey}
          />
        )
        : null,
      withNonce
        ? (
          <Nonce
            className='ui--AddressSummary-nonce'
            key='nonce'
            params={publicKey}
          >
            {t('addressSummary.transactions', {
              defaultValue: ' transactions'
            })}
          </Nonce>
        )
        : null
    ];
  }
}

export default translate(AddressSummary);

// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import storage from '@polkadot/storage';
import encodeAddress from '@polkadot/util-keyring/address/encode';
import classes from '@polkadot/ui-app/util/classes';
import withStorage from '@polkadot/ui-react-rx/with/storage';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import './index.css';

import StakeList from './StakeList';
import Summary from './Summary';

type Props = BareProps & {
  intentions?: Array<string>,
  validators?: Array<string>
};

const transformAddresses = (publicKeys: Array<Uint8Array>) =>
  publicKeys.map(encodeAddress);

class App extends React.PureComponent<Props> {
  render () {
    const { className, intentions = [], style, validators = [] } = this.props;

    return (
      <div
        className={classes('staking--App', className)}
        style={style}
      >
        <Summary
          intentions={intentions}
          validators={validators}
        />
        <StakeList
          intentions={intentions}
          validators={validators}
        />
      </div>
    );
  }
}

export default withMulti(
  App,
  withStorage(
    storage.staking.public.intentions,
    {
      propName: 'intentions',
      transform: transformAddresses
    }
  ),
  withStorage(
    storage.session.public.validators,
    {
      propName: 'validators',
      transform: transformAddresses
    }
  )
);

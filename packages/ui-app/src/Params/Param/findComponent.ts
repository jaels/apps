// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Param$Types } from '@polkadot/params/types';
import { Props, ComponentMap } from '../types';

import Account from './Account';
import Amount from './Amount';
import Bool from './Bool';
import Bytes from './Bytes';
import Code from './Code';
import Hash from './Hash';
import KeyValue from './KeyValue';
import KeyValueStorageArray from './KeyValueStorageArray';
import StringParam from './String';
import Unknown from './Unknown';
import VoteThreshold from './VoteThreshold';

const components: ComponentMap = {
  'AccountId': Account,
  'Balance': Amount,
  'BlockNumber': Amount,
  'bool': Bool,
  'Bytes': Bytes,
  'Code': Code,
  'Call': Unknown,
  'Digest': Unknown,
  'Hash': Hash,
  'Index': Amount,
  'KeyValue': KeyValue,
  'KeyValueStorage': KeyValue,
  'KeyValueStorage[]': KeyValueStorageArray,
  'MisbehaviorReport': Unknown,
  'ParachainId': Amount,
  'PropIndex': Amount,
  'Proposal': Unknown,
  'ReferendumIndex': Amount,
  'SessionKey': Amount,
  'Signature': Hash,
  'String': StringParam,
  'Timestamp': Amount,
  'u32': Amount,
  'u64': Amount,
  'VoteIndex': Amount,
  'VoteThreshold': VoteThreshold
};

export default function findComponent (type: Param$Types, overrides: ComponentMap = {}): React.ComponentType<Props> {
  if (Array.isArray(type)) {
    // Special case for components where we have a specific override formatter
    if (type.length === 1) {
      const arrayType = `${type}[]`;

      return overrides[arrayType] || components[arrayType] || Unknown;
    }

    return Unknown;
  }

  return overrides[type] || components[type] || Unknown;
}

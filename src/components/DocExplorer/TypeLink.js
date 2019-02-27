/**
 *  Copyright (c) Facebook, Inc. and its affiliates.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';

export default class TypeLink extends React.Component {
  static propTypes = {
    type: PropTypes.object,
    onClick: PropTypes.func,
    fieldName: PropTypes.string,
  };

  shouldComponentUpdate(nextProps) {
    return this.props.type !== nextProps.type;
  }

  render() {
    return renderType(
      this.props.type,
      this.props.onClick,
      this.props.fieldName,
    );
  }
}

function renderType(type, onClick, fieldName) {
  // this is needed for the second pane
  if (fieldName !== 'Query' && fieldName !== 'Subscription') {
    if (type instanceof GraphQLNonNull) {
      return (
        <span>
          {renderType(type.ofType, onClick)}
          {'!'}
        </span>
      );
    }
    if (type instanceof GraphQLList) {
      return (
        <span>
          {'['}
          {renderType(type.ofType, onClick)}
          {']'}
        </span>
      );
    }
  }
  return (
    <a className="type-name" onClick={event => onClick(type, event)}>
      {type.name}
    </a>
  );
}

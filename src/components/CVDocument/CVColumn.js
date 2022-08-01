import { Component } from 'react';
import { View } from '@react-pdf/renderer';

import styles from './styles';

export default class CVColumn extends Component {
  render() {
    const { style, children } = this.props;
    return <View style={[styles.column, style]}>{children}</View>;
  }
}

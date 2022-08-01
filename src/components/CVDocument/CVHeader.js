import { Component } from 'react';
import { Text, View } from '@react-pdf/renderer';
import styles from './styles';

export default class CVHeader extends Component {
  render() {
    const { values } = this.props;

    return (
      <View style={[styles.header, values.avatar && { padding: '40px 0' }]}>
        {values.avatar ? (
          <>
            <View style={styles.column}> </View>
            <View
              style={[
                styles.column,
                {
                  flexGrow: 1.5,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Text style={[styles.fullName, { fontSize: '18px' }]}>
                {values.firstName} {values.lastName}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.fullName}>
            {values.firstName} {values.lastName}
          </Text>
        )}
      </View>
    );
  }
}

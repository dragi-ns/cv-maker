import { Component } from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import cardBackgroundImage from '../../images/cv-card-background-image.jpg';
import styles from './styles';

export class CVCard extends Component {
  render() {
    const { style, children } = this.props;
    return (
      <View style={{ position: 'relative', marginBottom: '10px' }}>
        <Image style={styles.cardBackgroundImage} src={cardBackgroundImage} />
        <View style={[styles.card, style]}>{children}</View>
      </View>
    );
  }
}

export class CVCardHeader extends Component {
  render() {
    const { style, children } = this.props;
    return (
      <View style={[styles.cardHeader, style]}>
        <Text>{children}</Text>
      </View>
    );
  }
}

export class CVCardBody extends Component {
  render() {
    const { style, children } = this.props;
    return <View style={[styles.cardBody, style]}>{children}</View>;
  }
}

export class CVCardBodyListItem extends Component {
  render() {
    const { style, icon, text } = this.props;
    return (
      <View style={[styles.cardBodyRow, style]}>
        {icon && <Image style={styles.cardBodyRowIcon} src={icon} />}
        <Text style={styles.textWrap}>{text}</Text>
      </View>
    );
  }
}

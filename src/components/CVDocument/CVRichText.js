import { convertToRaw } from 'draft-js';
import { View, Text } from '@react-pdf/renderer';
import redraft from 'redraft';
import styles from './styles';
import { Component } from 'react';

export default class RichInput extends Component {
  render() {
    const { editorState } = this.props;
    const rawContent = convertToRaw(editorState.getCurrentContent());
    return redraft(rawContent, renderers, { blockFallback: 'unstyled' });
  }
}

const renderers = {
  inline: {
    // The key passed here is just an index based on rendering order inside a block
    BOLD: (children, { key }) => {
      return (
        <Text key={`bold-${key}`} style={{ fontWeight: 700 }}>
          {children}
        </Text>
      );
    },
    ITALIC: (children, { key }) => {
      return (
        <Text key={`italic-${key}`} style={{ fontStyle: 'italic' }}>
          {children}
        </Text>
      );
    },
    UNDERLINE: (children, { key }) => {
      return (
        <Text key={`underline-${key}`} style={{ textDecoration: 'underline' }}>
          {children}
        </Text>
      );
    },
  },
  /**
   * Blocks receive children and depth
   * Note that children are an array of blocks with same styling,
   */
  blocks: {
    unstyled: (children, { keys }) => {
      return children.map((child, index) => {
        return (
          <View key={keys[index]} style={{ marginBottom: '3px' }}>
            <Text style={styles.text}>{child}</Text>
          </View>
        );
      });
    },
    'unordered-list-item': (children, { depth, keys }) => {
      return (
        <UnorderedList key={keys[keys.length - 1]} depth={depth}>
          {children.map((child, index) => (
            <UnorderedListItem key={keys[index]}>{child}</UnorderedListItem>
          ))}
        </UnorderedList>
      );
    },
    'ordered-list-item': (children, { depth, keys }) => {
      return (
        <OrderedList key={keys.join('|')} depth={depth}>
          {children.map((child, index) => (
            <OrderedListItem key={keys[index]} index={index}>
              {child}
            </OrderedListItem>
          ))}
        </OrderedList>
      );
    },
  },
};

class UnorderedList extends Component {
  render() {
    const { children } = this.props;
    return <View style={styles.list}>{children}</View>;
  }
}

class UnorderedListItem extends Component {
  render() {
    const { children, style } = this.props;
    return (
      <View style={[styles.listItem, style]}>
        <Text style={styles.listItemText}>
          • &nbsp;<Text>{children}</Text>
        </Text>
      </View>
    );
  }
}

class OrderedList extends Component {
  render() {
    const { children } = this.props;
    return <View style={styles.list}>{children}</View>;
  }
}

class OrderedListItem extends Component {
  render() {
    const { index, style, children } = this.props;
    return (
      <View style={[styles.listItem, style]}>
        <Text style={styles.listItemText}>
          {index + 1}. &nbsp;<Text>{children}</Text>
        </Text>
      </View>
    );
  }
}

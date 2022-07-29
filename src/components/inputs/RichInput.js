import { Component } from 'react';
import { Editor, RichUtils, convertToRaw } from 'draft-js';
import {
  MdFormatBold,
  MdOutlineFormatItalic,
  MdOutlineFormatUnderlined,
  MdOutlineFormatListBulleted,
  MdOutlineFormatListNumbered,
} from 'react-icons/md';
import { Button } from '../buttons';
import classNames from 'classnames';
import draftToHtml from 'draftjs-to-html';
import 'draft-js/dist/Draft.css';
import { withTranslation } from 'react-i18next';

class RichInput extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
  }

  handleChange(editorState) {
    this.props.onChange(this.props.name, editorState);
  }

  handleFocus() {
    this.props.onFocus(this.props.name, true);
  }

  handleKeyCommand(command, editorState) {
    // Ignore monospaced style
    if (command === 'code') {
      return 'not-handled';
    }

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.handleChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  toggleBlockType(blockType) {
    this.handleChange(
      RichUtils.toggleBlockType(this.props.editorState, blockType)
    );
  }

  toggleInlineStyle(inlineStyle) {
    this.handleChange(
      RichUtils.toggleInlineStyle(this.props.editorState, inlineStyle)
    );
  }

  static getCharCount(editorState) {
    return editorState.getCurrentContent().getPlainText('').length;
  }

  static toHtml(editorState) {
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  }

  render() {
    const { t, editorState, label, error, maxLength } = this.props;

    // If the user changes block type before entering any text,
    // we can hide the placeholder.
    let className = 'rich-editor-editor';
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' rich-editor-hide-placeholder';
      }
    }

    const charCount = this.constructor.getCharCount(editorState);

    return (
      <div className="form-field col">
        <label>{label}</label>
        <div className="rich-editor-root">
          <div className="rich-editor-controls">
            <InlineStyleControls
              editorState={editorState}
              handleToggle={this.toggleInlineStyle}
            />
            <BlockStyleControls
              editorState={editorState}
              handleToggle={this.toggleBlockType}
            />
          </div>
          <div className={className}>
            <Editor
              editorState={editorState}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              handleKeyCommand={this.handleKeyCommand}
              placeholder={t('richInput.placeholder')}
            />
          </div>
        </div>
        <div className="rich-editor-indicators">
          {error && (
            <p className="rich-editor-error-indicator error">{t(error)}</p>
          )}
          <p className="rich-editor-count-indicator">
            {charCount}/{maxLength}
          </p>
        </div>
      </div>
    );
  }
}

export default withTranslation('form')(RichInput);

class ControlButton extends Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(event) {
    event.preventDefault();
    this.props.onToggle(this.props.style);
  }

  render() {
    const { active, icon } = this.props;
    return (
      <Button
        data={{ icon }}
        className={classNames({
          'rich-editor-control-btn': true,
          'rich-editor-control-btn--active': active,
        })}
        onMouseDown={this.handleToggle}
      />
    );
  }
}

const INLINE_STYLES = [
  { label: 'bold', icon: <MdFormatBold />, style: 'BOLD' },
  { label: 'italic', icon: <MdOutlineFormatItalic />, style: 'ITALIC' },
  {
    label: 'underline',
    icon: <MdOutlineFormatUnderlined />,
    style: 'UNDERLINE',
  },
];

class InlineStyleControls extends Component {
  render() {
    const { editorState, handleToggle } = this.props;
    const currentStyle = editorState.getCurrentInlineStyle();

    return (
      <>
        {INLINE_STYLES.map((type) => (
          <ControlButton
            key={type.label}
            icon={type.icon}
            label={type.label}
            style={type.style}
            active={currentStyle.has(type.style)}
            onToggle={handleToggle}
          />
        ))}
      </>
    );
  }
}

const BLOCK_STYLES = [
  {
    label: 'ul',
    icon: <MdOutlineFormatListBulleted />,
    style: 'unordered-list-item',
  },
  {
    label: 'ol',
    icon: <MdOutlineFormatListNumbered />,
    style: 'ordered-list-item',
  },
];

class BlockStyleControls extends Component {
  render() {
    const { editorState, handleToggle } = this.props;
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return (
      <>
        {BLOCK_STYLES.map((type) => (
          <ControlButton
            key={type.label}
            icon={type.icon}
            label={type.label}
            style={type.style}
            active={type.style === blockType}
            onToggle={handleToggle}
          />
        ))}
      </>
    );
  }
}

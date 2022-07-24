import { Component } from 'react';
import {
  Editor,
  RichUtils,
  getDefaultKeyBinding,
  convertToRaw,
} from 'draft-js';
import {
  MdFormatBold,
  MdOutlineFormatItalic,
  MdOutlineFormatUnderlined,
  MdOutlineFormatListBulleted,
  MdOutlineFormatListNumbered,
} from 'react-icons/md';
import classNames from 'classnames';
import draftToHtml from 'draftjs-to-html';

export default class RichInput extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this.mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
  }

  handleChange(editorState) {
    this.props.handleChange('objective', editorState);
  }

  handleKeyCommand(command, editorState) {
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

  mapKeyToEditorCommand(event) {
    if (event.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        event,
        this.props.editorState,
        1 /* maxDepth */
      );
      if (newEditorState !== this.props.editorState) {
        this.handleChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(event);
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

  getCharCount(editorState) {
    return editorState.getCurrentContent().getPlainText('').length;
  }

  render() {
    const { editorState } = this.props;

    // If the user changes block type before entering any text, we can hide it.
    let className = 'rich-editor-editor';
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' rich-editor-hide-placeholder';
      }
    }

    return (
      <div className="form-row row">
        <div className="form-field col">
          {this.props.locked ? (
            <>
              <p className="preview-name">Description</p>
              <p
                className="preview-value"
                dangerouslySetInnerHTML={{
                  __html: draftToHtml(
                    convertToRaw(editorState.getCurrentContent())
                  ),
                }}
              />
            </>
          ) : (
            <>
              <label>Description</label>
              <div className="rich-editor-root">
                <div className="rich-editor-controls">
                  <InlineStyleControls
                    editorState={this.props.editorState}
                    handleToggle={this.toggleInlineStyle}
                  />
                  <BlockStyleControls
                    editorState={this.props.editorState}
                    handleToggle={this.toggleBlockType}
                  />
                </div>
                <div className={className}>
                  <Editor
                    editorState={this.props.editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    keyBindingFn={this.mapKeyToEditorCommand}
                    onChange={this.handleChange}
                    onFocus={() =>
                      this.props.setFieldTouched('objective', true)
                    }
                    placeholder="Type your objective/goal here..."
                  />
                </div>
              </div>
              <div className="rich-editor-indicators">
                {this.props.error && (
                  <p className="rich-editor-error-indicator error">
                    {this.props.error}
                  </p>
                )}
                <p className="rich-editor-count-indicator">
                  {this.getCharCount(this.props.editorState)}/
                  {this.props.maxLength}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

class ControlButton extends Component {
  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(event) {
    event.preventDefault();
    this.props.handleToggle(this.props.style);
  }

  render() {
    return (
      <button
        type="button"
        className={classNames({
          btn: true,
          'rich-editor-control-btn': true,
          'rich-editor-control-btn--active': this.props.active,
        })}
        onMouseDown={this.handleToggle}>
        <span>{this.props.icon}</span>
      </button>
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

function InlineStyleControls(props) {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <>
      {INLINE_STYLES.map((type) => (
        <ControlButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          icon={type.icon}
          handleToggle={props.handleToggle}
          style={type.style}
        />
      ))}
    </>
  );
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

function BlockStyleControls(props) {
  const { editorState } = props;
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
          active={type.style === blockType}
          label={type.label}
          icon={type.icon}
          handleToggle={props.handleToggle}
          style={type.style}
        />
      ))}
    </>
  );
}

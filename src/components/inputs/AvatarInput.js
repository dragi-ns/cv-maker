import { Component } from 'react';
import { MdAddAPhoto } from 'react-icons/md';

export default class AvatarInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarImg: null,
    };
    this.handleAvatarUpload = this.handleAvatarUpload.bind(this);
    this.handleAvatarRemove = this.handleAvatarRemove.bind(this);
  }

  // Fixme: When the user uploads a file that it isn't supported
  handleAvatarUpload(event) {
    const { name, onChange } = this.props;

    const reader = new FileReader();
    const file = event.currentTarget.files[0];
    onChange(name, file);

    reader.onload = () => {
      if (!this.props.error) {
        this.setState({ avatarImg: reader.result });
      } else {
        this.setState({ avatarImg: null });
      }
    };

    reader.onerror = () => {
      // TODO: Handle an error when file cannot be read.
    };

    reader.readAsDataURL(file);
  }

  handleAvatarRemove() {
    const { name, onChange } = this.props;
    this.setState({ avatarImg: null });
    onChange(name, null);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.avatarImg === null) {
      return state;
    }

    if (!props.value) {
      return { avatarImg: null };
    }

    return state;
  }

  render() {
    const { id, name, error, supportedFormats } = this.props;
    return (
      <div className="form-avatar-container col">
        <div className="form-avatar">
          <div className="form-field col">
            {this.state.avatarImg ? (
              <>
                <img src={this.state.avatarImg} alt="avatar" />
                <div className="upload-edit col">
                  <label className="btn" htmlFor={id || name}>
                    Edit avatar
                  </label>
                  <button
                    type="button"
                    className="btn"
                    onClick={this.handleAvatarRemove}>
                    Remove avatar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="upload-icon">
                  <MdAddAPhoto />
                </div>
                <label className="btn" htmlFor={id || name}>
                  Add avatar (optional)
                </label>
              </>
            )}
            <input
              id={id || name}
              name={name || id}
              type="file"
              accept={supportedFormats}
              onChange={this.handleAvatarUpload}
              hidden
            />
          </div>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }
}

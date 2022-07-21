import { Component } from 'react';
import { MdAddAPhoto } from 'react-icons/md';
import { AVATAR_SUPPORTED_FORMATS } from './GeneralInformationSchema';

export default class AvatarInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarImg: null,
    };

    this.handleAvatarUpload = this.handleAvatarUpload.bind(this);
    this.removeAvatar = this.removeAvatar.bind(this);
  }

  handleAvatarUpload(event) {
    const reader = new FileReader();
    const file = event.currentTarget.files[0];
    this.props.setFieldValue('avatar', file);

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

  removeAvatar() {
    this.setState({ avatarImg: null });
    this.props.setFieldValue('avatar', {});
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
    return (
      <div className="form-avatar-container col">
        <div className="form-avatar">
          <div className="form-field col">
            {this.state.avatarImg ? (
              <>
                <img src={this.state.avatarImg} alt="avatar" />
                {!this.props.locked && (
                  <div className="upload-edit col">
                    <label
                      className="btn"
                      htmlFor={this.props.id || this.props.name}>
                      Edit avatar
                    </label>
                    <button
                      type="button"
                      className="btn"
                      onClick={this.removeAvatar}>
                      Remove avatar
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="upload-icon">
                  <MdAddAPhoto />
                </div>
                {!this.props.locked && (
                  <label
                    className="btn"
                    htmlFor={this.props.id || this.props.name}>
                    Add avatar (optional)
                  </label>
                )}
              </>
            )}
            <input
              id={this.props.id || this.props.name}
              name={this.props.name || this.props.id}
              type="file"
              accept={AVATAR_SUPPORTED_FORMATS.join(', ')}
              onChange={this.handleAvatarUpload}
              hidden
            />
          </div>
        </div>
        {this.props.error && <p className="error">{this.props.error}</p>}
      </div>
    );
  }
}

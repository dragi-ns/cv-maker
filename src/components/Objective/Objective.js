import { Component } from 'react';
import { MdLockOutline, MdOutlineClear } from 'react-icons/md';
import 'draft-js/dist/Draft.css';
import RichInput from '../inputs/RichInput';

export default class Objective extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locked: false,
    };

    this.toggleLocked = this.toggleLocked.bind(this);
  }

  async toggleLocked() {
    if (this.props.formik.isValid) {
      this.setState((prevState) => {
        return { locked: !prevState.locked };
      });
    }
  }

  render() {
    return (
      <fieldset className="form-section">
        <legend>Objective/Goal</legend>
        <RichInput
          locked={this.state.locked}
          editorState={this.props.formik.values.objective}
          handleChange={this.props.formik.setFieldValue}
          setFieldTouched={this.props.formik.setFieldTouched}
          error={this.props.formik.errors.objective}
          maxLength={256}
        />
        <div className="section-controls row">
          <button
            type="button"
            className="btn"
            onClick={this.props.formik.resetForm}>
            <span>
              <MdOutlineClear />
            </span>
            <span>Reset</span>
          </button>
          <button type="button" className="btn" onClick={this.toggleLocked}>
            <span>
              <MdLockOutline />
            </span>
            <span>Lock</span>
          </button>
        </div>
      </fieldset>
    );
  }
}

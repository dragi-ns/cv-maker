import { Component } from 'react';
import { MdLockOutline, MdLockOpen, MdOutlineClear } from 'react-icons/md';
import RichInput from '../inputs/RichInput';
import ObjectiveInitialValues from './ObjectiveInitialValues';
import { MAX_LENGTH } from './ObjectiveSchema';
import 'draft-js/dist/Draft.css';

export default class ObjectiveForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locked: false,
    };
    this.toggleLocked = this.toggleLocked.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  async toggleLocked() {
    const { errors } = this.props.formik;
    if (!errors.objective) {
      this.setState((prevState) => {
        return { locked: !prevState.locked };
      });
    }
  }

  handleReset() {
    const { values, errors, resetForm } = this.props.formik;
    resetForm({
      ...this.props.formik,
      values: { ...values, ...ObjectiveInitialValues },
      errors: { ...errors, objective: '' },
    });
  }

  render() {
    const { values, errors, setFieldValue, setFieldTouched } =
      this.props.formik;
    return (
      <fieldset className="form-section">
        <legend>Objective/Goal</legend>
        <RichInput
          label="Description"
          name="objective"
          locked={this.state.locked}
          editorState={values.objective}
          error={errors.objective}
          onChange={setFieldValue}
          onFocus={setFieldTouched}
          maxLength={MAX_LENGTH}
        />
        <div className="section-controls row">
          {!this.state.locked && (
            <button type="button" className="btn" onClick={this.handleReset}>
              <span>
                <MdOutlineClear />
              </span>
              <span>Reset</span>
            </button>
          )}
          <button type="button" className="btn" onClick={this.toggleLocked}>
            {this.state.locked ? (
              <>
                <span>
                  <MdLockOpen />
                </span>
                <span>Unlock</span>
              </>
            ) : (
              <>
                <span>
                  <MdLockOutline />
                </span>
                <span>Lock</span>
              </>
            )}
          </button>
        </div>
      </fieldset>
    );
  }
}

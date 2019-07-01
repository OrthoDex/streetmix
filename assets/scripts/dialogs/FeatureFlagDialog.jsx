/**
 * Feature flags (dialog box)
 *
 * Secret menu.
 *
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Dialog from './Dialog'
import Checkbox from '../ui/Checkbox'
import FEATURE_FLAGS from '../../../app/data/flags'
import { setFeatureFlag } from '../store/actions/flags'
import './FeatureFlagDialog.scss'

class FeatureFlagDialog extends React.Component {
  static propTypes = {
    flags: PropTypes.object.isRequired,
    setFeatureFlag: PropTypes.func.isRequired
  }

  renderFlagList = () => {
    return Object.entries(FEATURE_FLAGS).map((item) => {
      const id = item[0]
      const deets = item[1]
      const htmlLabel = `feature-flag__input--${id.toLowerCase().replace(/_/g, '-')}`

      // Bail if a defined flag is not in the store (e.g. in tests with mock stores)
      if (!this.props.flags[id]) return

      // If the setting has changed, display it differently
      const isNotDefault = deets.defaultValue !== this.props.flags[id].value
      const labelClassName = isNotDefault ? 'feature-flag-label-modified' : ''

      return (
        <li key={id}>
          <Checkbox
            id={htmlLabel}
            onChange={(event) => {
              this.props.setFeatureFlag(id, event.target.checked)
            }}
            checked={this.props.flags[id].value}
            disabled={deets.enabled === false}
          >
            <span className={labelClassName}>{deets.label}</span>
          </Checkbox>
        </li>
      )
    })
  }

  render () {
    return (
      <Dialog>
        {(closeDialog) => (
          <div className="feature-flag-dialog">
            <header>
              <h1>Feature flags</h1>
            </header>
            <div className="dialog-content">
              <ul>
                {this.renderFlagList()}
              </ul>
            </div>
            <button className="dialog-primary-action" onClick={closeDialog}>
              Close
            </button>
          </div>
        )}
      </Dialog>
    )
  }
}

function mapStateToProps (state) {
  return {
    flags: state.flags
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setFeatureFlag: (flag, value) => { dispatch(setFeatureFlag(flag, value)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeatureFlagDialog)

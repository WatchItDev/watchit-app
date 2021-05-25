import React from 'react'
import PropTypes from 'prop-types'
import uid from 'shortid'

export default class NavBarMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      label: false
    }
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    return !Object.is(nextState.label, this.state.label)
  }

  static get propTypes () {
    return {
      list: PropTypes.array.isRequired,
      btnText: PropTypes.string.isRequired
    }
  }

  componentDidMount () {
    // If need for initial item
    if (this.props.onGetInitialItem) {
      this.props.list.map((i, k) => {
        if (!i.default) return true
        // Call method
        this.props.onGetInitialItem(
          this.props.list[k]
        )
        // Stop loop
        return false
      })
    }
  }

  handlePreventDefault (e) {
    e.preventDefault()
  }

  handleClick = (e) => {
    /***
     * On click event over menu
     * @dataset {label: string, action: string, type: string}
     */

    // On change
    this.handlePreventDefault(e)
    const obj = e.target
    const dataset = obj.dataset
    const { label } = dataset

    // Assign new label
    this.setState({ label: label })
    // Select action
    if (this.props.onChange) { this.props.onChange(dataset) }
  }

  render () {
    return (
      <ul className='dropdown'>
        {/* Check for valid list of subs */}
        {
          this.props.list.length > 0 &&
            <li>
              <a className='dropdown-button' onClick={this.handlePreventDefault} href='/'>
                <i
                  className={`${this.props.icon || 'icon-triangle-down'} white-text nav-var-icon normalize-small-icon left margin-right-4`}
                />
                <span className='white-text'>{this.props.btnText}</span>
                {
                /* The main button */
                // Set personalized label
                (this.state.label &&
                  <span className='dropdown-result no-bold blue-text'>
                    {this.state.label}
                  </span>
                ) || this.props.list.map((i) => {
                  return (
                    i.default &&
                      <span className='dropdown-result no-bold blue-text' key={uid.generate()}>
                        {i.label}
                      </span>
                  )
                })
              }
              </a>

              {/* Menu List */}
              <div className='dropdown-content relative'>
                <ul>
                  {
                  /* The sub menu items */
                  this.props.list.map((i) => {
                    return (
                      <li key={uid.generate()}>
                        <a
                          onClick={this.handleClick} className='drop-item' href='/'
                          data-action={i.action} data-label={i.label} data-type={i.type}
                        >
                          <span className='pointer-events-none'>{i.label}</span> {i.icon}
                        </a>
                      </li>
                    )
                  })
                }
                </ul>
              </div>
            </li>
        }
      </ul>
    )
  }
}

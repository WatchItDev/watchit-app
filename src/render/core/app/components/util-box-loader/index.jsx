import React from 'react'
import AudioLoader from 'render/media/img/spinner/audio.svg'
export default class BoxLoader extends React.PureComponent {
  static get defaultProps () {
    return {
      size: 83
    }
  }

  render () {
    return (
      <section
        className={'width-' + this.props.size + '-p col absolute full-height top-0 right-0 valign-wrapper'}
      >
        <div className='valign center-block'>
          <div className='preloader-wrapper active'>
            <img
              alt='' className='bar-loader' src={AudioLoader}
              {...this.props}
            />
          </div>
        </div>
      </section>
    )
  }
}

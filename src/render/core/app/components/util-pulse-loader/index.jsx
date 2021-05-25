import React from 'react'

export default React.memo((props) => {
  return (
    <div className='spinner' {...props}>
      <div className='double-bounce1' />
      <div className='double-bounce2' />
    </div>
  )
})

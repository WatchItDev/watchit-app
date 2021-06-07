import React from 'react'
import Input from 'components/app-inputs/'

const CatalogSearchInput = (props) => {
  return (
    <form onSubmit={(e) => { e.preventDefault() }} action='#'>
      <Input
        icon='icon-tv' onInput={props.onInput} required
        {...!Object.is(props.value, undefined) && { value: props.value }}
        autoComplete='off' type='text' placeholder='Search...' name='search'
      />
    </form>
  )
}

CatalogSearchInput.defaultProps = {
  onInput: () => {}
}

export default CatalogSearchInput

import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import ExploreLoader from '../explore-loader'

describe('Testing in the <explore-loader/> component ', () => {
  it('should match snapshot', () => {
    const {container} = render(<ExploreLoader/>)
    expect(container).toMatchSnapshot()
  })
 })

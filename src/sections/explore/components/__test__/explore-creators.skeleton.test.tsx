import {describe,expect,it} from 'vitest'
import {render} from '@testing-library/react'
import { ExploreCreatorsSkeleton } from '../explore-creators.skeleton';

describe('Testing in the <ExploreCreatorsSkeleton/> ', () => {
  it('should render the skeleton and match snapshot', () => {
    const { container } = render(<ExploreCreatorsSkeleton/>);
    expect(container).toMatchSnapshot();
  });
})


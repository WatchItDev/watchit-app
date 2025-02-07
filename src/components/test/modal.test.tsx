import { MemoryRouter } from 'react-router';

// Testing libraries
import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';

// Base testing component
import Modal, {ModalProps} from "@src/components/modal.tsx";

const RenderComponent = (props: ModalProps) => render(<MemoryRouter><Modal {...props} /></MemoryRouter>);

describe('Modal component testing', () => {
  const modalProps = {
    onClose: () => {},
    title: 'Modal title',
    open: true,
    renderContent: <div>Modal content</div>
  }

  afterEach(() => {
    cleanup();
  })

  it('to match snapshot', () => {
    const { asFragment } = RenderComponent(modalProps);
    expect(asFragment()).toMatchSnapshot();
  });

  // Test if title is equal to 'Modal title'
  it('title is equal to "Modal title"', () => {
    const { getByText } = RenderComponent(modalProps);
    expect(getByText('Modal title')).toBeInTheDocument();
  });

  // Pass false to open prop and check if not "Modal title" is in the document
  it('title is not in the document', () => {
    const { queryByText } = RenderComponent({ ...modalProps, open: false });
    expect(queryByText('Modal title')).not.toBeInTheDocument();
  });
});

// Testing libraries
import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';

// Base testing component
import Modal, { ModalProps } from "@src/components/modal.tsx";

const fn = vi.fn();
const renderComponent = (props: ModalProps) => render(<Modal {...props} />);

describe('[COMPONENTS]: Modal component testing', () => {
  const modalProps = {
    onClose: fn,
    title: 'Modal title',
    open: true,
    renderContent: <div>This is the body of the modal</div>
  }

  afterEach(() => {
    cleanup();
  })

  it('to match snapshot', () => {
    const { baseElement } = renderComponent(modalProps);
    expect(baseElement).toMatchSnapshot()
  });

  it('title is equal to "Modal title"', () => {
    const { getByText } = renderComponent(modalProps);
    expect(getByText('Modal title')).toBeInTheDocument();
  });

  it('title is not in the document when open is false', () => {
    const { queryByText } = renderComponent({ ...modalProps, open: false });
    expect(queryByText('Modal title')).not.toBeInTheDocument();
  });

  it('content is equal to "Modal content"', () => {
    const { getByText } = renderComponent(modalProps);
    expect(getByText(/This is the body of the modal/i)).toBeInTheDocument();
  });

  it('onClose is called when the modal is closed', async () => {
    renderComponent(modalProps);
    const backdrop = document.querySelector('.MuiModal-backdrop');
    // @ts-ignore
    fireEvent.click(backdrop);
    expect(modalProps.onClose).toHaveBeenCalledTimes(1);
  });
});

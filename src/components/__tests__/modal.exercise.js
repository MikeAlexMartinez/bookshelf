import React from 'react';

// 🐨 you're gonna need this stuff:
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Modal, ModalContents, ModalOpenButton} from '../modal'

const TestModal = () => (
  <Modal>
    <ModalOpenButton>
      <button>Open Modal</button>
    </ModalOpenButton>
    <ModalContents aria-label="Test Modal" title="Test Modal">
      <div>Modal Contents</div>
    </ModalContents>
  </Modal>
);

// test.todo('can be opened and closed')
it('should be able to open and close the modal', () => {
  // 🐨 render the Modal, ModalOpenButton, and ModalContents
  render(<TestModal />);

  // 🐨 click the open button
  const openButton = screen.getByText('Open Modal');
  userEvent.click(openButton);

  // 🐨 verify the modal contains the modal contents, title, and label
  expect(screen.getByText('Test Modal')).not.toBeNull();
  expect(screen.getByText('Modal Contents')).not.toBeNull();

  // 🐨 click the close button
  const closeButton = screen.getByText('Close');
  userEvent.click(closeButton);

  // 🐨 verify the modal is no longer rendered
  // 💰 (use `query*` rather than `get*` or `find*` queries to verify it is not rendered)
  const contents = screen.queryByText('Modal Contents');
  expect(contents).toBeNull();
});

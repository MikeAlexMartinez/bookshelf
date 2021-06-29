/** @jsx jsx */
import {jsx} from '@emotion/core'

// 🐨 you're going to need the Dialog component
// It's just a light wrapper around ReachUI Dialog
// 📜 https://reacttraining.com/reach-ui/dialog/
import React from "react"
import VisuallyHidden from '@reach/visually-hidden'
import {
  CircleButton,
  Dialog,
} from './lib'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

// 💰 Here's a reminder of how your components will be used:
/*
<Modal>
  <ModalOpenButton>
    <button>Open Modal</button>
  </ModalOpenButton>
  <ModalContents aria-label="Modal label (for screen readers)">
    <ModalDismissButton>
      <button>Close Modal</button>
    </ModalDismissButton>
    <h3>Modal title</h3>
    <div>Some great contents of the modal</div>
  </ModalContents>
</Modal>
*/

// we need this set of compound components to be structurally flexible
// meaning we don't have control over the structure of the components. But
// we still want to have implicitly shared state, so...
// 🐨 create a ModalContext here with React.createContext
const ModalContext = React.createContext();
ModalContext.displayName = 'ModalContext';

// 🐨 create a Modal component that manages the isOpen state (via useState)
// and renders the ModalContext.Provider with the value which will pass the
// isOpen state and setIsOpen function
export function Modal({ children }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ModalContext.Provider>
  );
}

function useModal() {
  const context = React.useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within the Modal component');
  }
  return context;
}

// 🐨 create a ModalDismissButton component that accepts children which will be
// the button which we want to clone to set it's onClick prop to trigger the
// modal to close
// 📜 https://reactjs.org/docs/react-api.html#cloneelement
// 💰 to get the setIsOpen function you'll need, you'll have to useContext!
// 💰 keep in mind that the children prop will be a single child (the user's button)
export function ModalDismissButton({ onClick, children: child }) {
  const { setIsOpen } = useModal();

  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  });
}

// 🐨 create a ModalOpenButton component which is effectively the same thing as
// ModalDismissButton except the onClick sets isOpen to true
export function ModalOpenButton({ onClick, children: child }) {
  const { setIsOpen } = useModal();

  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  });
}
// 🐨 create a ModalContents component which renders the Dialog.
// Set the isOpen prop and the onDismiss prop should set isOpen to close
// 💰 be sure to forward along the rest of the props (especially children).

export function ModalContentsBase(props) {
  const { setIsOpen, isOpen } = useModal();

  return (
    <Dialog
      onDismiss={() => setIsOpen(false)}
      isOpen={isOpen}
      {...props}
    />
  );
}

export function ModalContents({ title, children, ...rest }) {
  return (
    <ModalContentsBase
      {...rest}
    >
      <div css={{display: 'flex', justifyContent: 'flex-end'}}>
        {/* 💰 here's what you should put in your <ModalDismissButton> */}
        <ModalDismissButton>
          <CircleButton onClick={() => console.log('dismiss')}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
      {children}
    </ModalContentsBase>
  );
}

// 🐨 don't forget to export all the components here

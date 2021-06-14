// 🐨 you'll need to import React and ReactDOM up here
import React from 'react';
import ReactDOM from 'react-dom';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';

// 🐨 you'll also need to import the Logo component from './components/logo'
import {Logo} from './components/logo';
import LoginForm from './components/LoginForm';

const dialogs = {
  login: 'login',
  register: 'register',
};

function StartDialog({ dialog, ...rest }) {
  switch (dialog) {
    case dialogs.login:
      return <LoginDialog {...rest} />;
    case dialogs.register:
      return <RegisterDialog {...rest} />;  
    default:
      return null;
  }
}

function LoginDialog({ close }) {
  const handleSubmit = (val) => {
    console.log(`login handleSubmit: `, val);
  }

  return (
    <Dialog isOpen onDismiss={close} aria-label="login dialog">
      <LoginForm onSubmit={handleSubmit} buttonText="Login" close={close} />
    </Dialog>
  );
}

function RegisterDialog({ close }) {
  const handleRegister = (val) => {
    console.log(`register handleSubmit: `, val);
  }

  return (
    <Dialog isOpen onDismiss={close} aria-label="register dialog">
      <LoginForm onSubmit={handleRegister} buttonText="Register" close={close} />
    </Dialog>
  );
}

// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
function App() {
  const [dialog, setDialog] = React.useState(null);

  // 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked
  const openDialog = (dialogType) => () => setDialog(dialogType);
  const closeDialog = () => setDialog(null);

  return (
    <div>
      <Logo />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={openDialog(dialogs.login)}>Login</button>
        <button onClick={openDialog(dialogs.register)}>Register</button>
      </div>
      <StartDialog dialog={dialog} close={closeDialog} />
    </div>
  );
}

// 🐨 use ReactDOM to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')
ReactDOM.render(<App />, document.getElementById('root'));

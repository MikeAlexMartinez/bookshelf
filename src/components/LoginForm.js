import React from 'react';

function LoginForm({ onSubmit, buttonText, close }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleUsernameChange = ({ target: { value } }) => {
    setUsername(value);
  }
  const handlePasswordChange = ({ target: { value } }) => {
    setPassword(value);
  }

  const handleFormSubmission = (event) => {
    event.preventDefault();
    onSubmit({
      username,
      password,
    });
  }

  return (
    <>
      <button type="button" onClick={close}>X</button>
      <form onSubmit={handleFormSubmission}>
        <label htmlFor="username">Username: </label>
        <input id="username" type="text" name="username" onChange={handleUsernameChange} />
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" onChange={handlePasswordChange} />
        <button type="submit">{buttonText}</button>
      </form>
    </>
  );
}

export default LoginForm;

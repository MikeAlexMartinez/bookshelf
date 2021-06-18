/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
// 🐨 you're going to need this:
// import * as auth from 'auth-provider'
import * as auth from 'auth-provider'
import {client} from './utils/api-client';
import {useAsync} from './utils/hooks';
import {FullPageSpinner} from './components/lib'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import * as colors from './styles/colors'

function App() {
  // 🐨 useState for the user
  const { data: user, error, isIdle, isLoading, isSuccess, isError, run, setData } = useAsync();

  // 🐨 create a login function that calls auth.login then sets the user
  // 💰 const login = form => auth.login(form).then(u => setUser(u))
  const login = form => auth.login(form).then(u => setData(u));
  // 🐨 create a registration function that does the same as login except for register
  const register = form => auth.register(form).then(u => setData(u));

  // 🐨 create a logout function that calls auth.logout() and sets the user to null
  const logout = () => {
    setData(null);
    auth.logout();
  }

  React.useEffect(() => {
    const getToken = async () => {
      return auth.getToken().then((token) => {
        if (token) {
          // we're logged in! Let's go get the user's data:
          return client('me', {token}).then(data => data.user);
        } else {
          return null;
        }
      });
    };

    run(getToken());
  }, [run, setData]);

  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }
  
  if (isSuccess) {
    // 🐨 if there's a user, then render the AuthenticatedApp with the user and logout
    // 🐨 if there's not a user, then render the UnauthenticatedApp with login and register
    return user ? <AuthenticatedApp user={user} logout={logout} /> : <UnauthenticatedApp login={login} register={register} />;
  }
  
  // must be error?
  return (
    <div
      css={{
        color: colors.danger,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <p>Uh oh... There's a problem. Try refreshing the app.</p>
      <pre>{isError ? error.message : 'Unexpected error'}</pre>
    </div>
  )
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/

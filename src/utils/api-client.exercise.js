import * as auth from '../auth-provider';

const apiURL = process.env.REACT_APP_API_URL

function client(
  endpoint,
  {token, headers: customHeaders, data, ...customConfig} = {}
) {
  const config = {
    method: 'GET',
    ...(customConfig.method === 'POST' && data ? { body: data } : {}),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  };

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if (response.status === 401) {
      auth.logout();
      window.location.assign(window.location);
      return Promise.reject({ message: 'Please' });
    }
    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}

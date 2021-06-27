import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {ReactQueryConfigProvider} from 'react-query'
import {App} from './app'

const queryConfig = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry(retryCount, error) {
      if (error.status === 404) return false;
      else if (retryCount < 2) return true;
      else return false;
    },
  },
}

const WrappedApp = () => (
  <ReactQueryConfigProvider config={queryConfig}>
    <App />
  </ReactQueryConfigProvider>
)

loadDevTools(() => {
  ReactDOM.render(<WrappedApp />, document.getElementById('root'))
})

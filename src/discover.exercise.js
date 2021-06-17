/** @jsx jsx */
import {jsx} from '@emotion/core'
import React from 'react';

import './bootstrap'
import Tooltip from '@reach/tooltip'
import {FaSearch, FaTimes} from 'react-icons/fa'
import {Input, BookListUL, Spinner} from './components/lib'
import {BookRow} from './components/book-row'
// 🐨 import the client from './utils/api-client'
import {useAsync} from 'utils/hooks'
import { client } from './utils/api-client.exercise';
import * as colors from './styles/colors';

const statuses = {
  IDLE: 'idle',
  SUCCESS: 'success',
  LOADING: 'loading',
  ERROR: 'error',
};

function DiscoverBooksScreen() {
  // upto Extra 1
  // // 🐨 add state for status ('idle', 'loading', or 'success'), data, and query
  // const [status, setStatus] = React.useState(statuses.IDLE);
  // const [data, setData] = React.useState(null);
  // const [error, setError] = React.useState(null);
  // const [query, setQuery] = React.useState(null);
  // // 🐨 you'll also notice that we don't want to run the search until the
  // // user has submitted the form, so you'll need a boolean for that as well
  // // 💰 I called it "queried"
  // const [queried, setQueried] = React.useState(false);

  // // 🐨 replace these with derived state values based on the status.
  // const hasError = status === statuses.ERROR;
  // const isLoading = status === statuses.LOADING;
  // const isSuccess = status === statuses.SUCCESS;

  // // 🐨 Add a useEffect callback here for making the request with the
  // // client and updating the status and data.
  // // 💰 Here's the endpoint you'll call: `books?query=${encodeURIComponent(query)}`
  // // 🐨 remember, effect callbacks are called on the initial render too
  // // so you'll want to check if the user has submitted the form yet and if
  // // they haven't then return early (💰 this is what the queried state is for).
  // React.useEffect(() => {
  //   if (query && queried && !isLoading) {
  //     setStatus(statuses.LOADING);
  //     client(`books?query=${encodeURIComponent(query)}`)
  //       .then((responseData) => {
  //         setData(responseData);
  //         setStatus(statuses.SUCCESS);
  //       })
  //       .catch((error) => {
  //         setError(error);
  //         setStatus(statuses.ERROR);
  //       })
  //     setQueried(false);
  //   }
  // }, [query, queried, isLoading]);

  // function handleSearchSubmit(event) {
  //   // 🐨 call preventDefault on the event so you don't get a full page reload
  //   event.preventDefault();
  //   setStatus(statuses.IDLE);
  //   setError(null);
  //   // 🐨 set the queried state to true
  //   setQueried(true);
  //   // 🐨 set the query value which you can get from event.target.elements
  //   // 💰 console.log(event.target.elements) if you're not sure.
  //   setQuery(event.target.elements.search.value);
  // }

  // extra 2
  const {data, error, run, isLoading, isError, isSuccess} = useAsync()
  const [query, setQuery] = React.useState(null);
  const [queried, setQueried] = React.useState(false);

  React.useEffect(() => {
    if (query && queried) {
      run(client(`books?query=${encodeURIComponent(query)}`));
    }
  }, [query, queried, run])

  function handleSearchSubmit(event) {
    event.preventDefault();
    setQueried(true);
    setQuery(event.target.elements.search.value);
  }

  return (
    <div
      css={{maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0'}}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
              disabled={isLoading}
            >
              {isLoading
                ? <Spinner />
                : isError
                ? <FaTimes aria-label="error" css={{color: colors.danger}} />
                : <FaSearch aria-label="search" />
              }
            </button>
          </label>
        </Tooltip>
      </form>
      {isError ? (
        <div css={{color: colors.danger}}>
          <p>There was an error:</p>
          <pre>{error.message}</pre>
        </div>
      ) : null}
      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  )
}

export {DiscoverBooksScreen}

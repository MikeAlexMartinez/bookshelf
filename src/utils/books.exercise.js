import {useQuery, queryCache} from 'react-query'

import {client} from 'utils/api-client'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

function booksSearchQueryFn(query, token) {
  return () => client(`books?query=${encodeURIComponent(query)}`, {token})
    .then(data => data.books)
}

function getBookSearchConfig(query, user) {
  return {
    queryKey: ['bookSearch', {query}],
    queryFn: booksSearchQueryFn(query, user.token),
    config: {
      onSuccess(books) {
        books.forEach(book => setQueryDataForBook(book))
      }
    }
  }
}

export function setQueryDataForBook(book) {
  queryCache.setQueryData(
    ['book', { bookId: book.id }],
    book
  );
}

export function useBook(bookId, user) {
  const { data } = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () => client(`books/${bookId}`, {token: user.token}).then(data => data.book),
  });
  return data ?? loadingBook;
}

export function useBookSearch(query, user) {
  const result = useQuery(getBookSearchConfig(query, user));
  return {...result, books: result.data ?? loadingBooks }
}

export async function refetchBookSearchQuery(user) {
  queryCache.removeQueries('bookSearch');
  await queryCache.prefetchQuery(getBookSearchConfig('', user));
}
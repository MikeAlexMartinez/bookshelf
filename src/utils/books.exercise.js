import {useQuery} from 'react-query'

import {client} from 'utils/api-client'

export function useBook(bookId, user) {
  const { data } = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () => client(`books/${bookId}`, {token: user.token})
  });
  return data?.book ?? null;
}

export function useBookSearch(query, user) {
  return useQuery({
    queryKey: ['bookSearch', {query}],
    queryFn: () => {
      return client(`books?query=${encodeURIComponent(query)}`, {token: user.token})
        .then(data => data.books);
    },
  })
}

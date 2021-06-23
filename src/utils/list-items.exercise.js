import {useQuery, useMutation, queryCache} from 'react-query'
// 🐨 you'll also need client from 'utils/api-client'
import {client} from 'utils/api-client'

export function useListItems(user) {
  const { data } = useQuery({
    queryKey: 'list-items',
    queryFn: () => client(`list-items`, { token: user.token }).then(data => data.listItems)
  });
  return data?.listItems ?? null;
}

export function useListItem(user, bookId) {
  const listItems = useListItems(user);
  return listItems?.find(listItem => listItem.bookId === bookId) ?? null;
}

export function useListItemMutation(mutatorFn) {
  const [mutation] = useMutation(mutatorFn, {
    onSettled: () => queryCache.invalidateQueries('list-items')
  });
  return mutation;
}

export function useUpdateListItem(user) {
  return useListItemMutation(data =>
    client(`list-items/${data.id}`, { token: user.token, method: 'PUT', data })
  );
}

export function useRemoveListItem(user) {
  return useListItemMutation(
    id => client(`list-items/${id}`, { token: user.token, method: 'DELETE' })
  );
}

export function useCreateListItem(user) {
  return useListItemMutation(
    data => client(`list-items`, { token: user.token, method: 'POST', data})
  )
}

// 🐨 instead of React Testing Library, you'll use React Hooks Testing Library
import {renderHook, act} from '@testing-library/react-hooks'
// 🐨 Here's the thing you'll be testing:
import {useAsync} from '../hooks'

function getUseAsyncState(overrides) {
  return {
    error: null,
    data: null,
    status: 'idle',
    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,
    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
    ...overrides,
  };
}

// 💰 I'm going to give this to you. It's a way for you to create a promise
// which you can imperatively resolve or reject whenever you want.
function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

// Use it like this:
// const {promise, resolve} = deferred()
// promise.then(() => console.log('resolved'))
// do stuff/make assertions you want to before calling resolve
// resolve()
// await promise
// do stuff/make assertions you want to after the promise has resolved

// 🐨 flesh out these tests
// test.todo('calling run with a promise which resolves')
it('calling run with a promise which resolves', async () => {
  // 🐨 get a promise and resolve function from the deferred utility
  // 🐨 use renderHook with useAsync to get the result
  // 🐨 assert the result.current is the correct default state
  const {promise, resolve} = deferred();
  const {result} = renderHook(() => useAsync());
  expect(result.current).toEqual(getUseAsyncState());

  // 🐨 call `run`, passing the promise
  //    (💰 this updates state so it needs to be done in an `act` callback)
  act(() => {
    result.current.run(promise);
  });

  // 🐨 assert that result.current is the correct pending state
  expect(result.current).toEqual(getUseAsyncState({
    status: 'pending',
    isLoading: true,
    isIdle: false,
  }));

  // 🐨 call resolve and wait for the promise to be resolved
  //    (💰 this updates state too and you'll need it to be an async `act` call so you can await the promise)
  const testData = { test: 'data' };
  await act(async () => {
    resolve(testData);
  });

  // 🐨 assert the resolved state
  expect(result.current).toEqual(getUseAsyncState({
    status: 'resolved',
    isSuccess: true,
    isIdle: false, 
    data: testData,
  }));

  // 🐨 call `reset` (💰 this will update state, so...)
  // 🐨 assert the result.current has actually been reset
  act(() => {
    result.current.reset();
  });

  expect(result.current).toEqual(getUseAsyncState());
})

// test.todo('calling run with a promise which rejects')
// 🐨 this will be very similar to the previous test, except you'll reject the
// promise instead and assert on the error state.
// 💰 to avoid the promise actually failing your test, you can catch
//    the promise returned from `run` with `.catch(() => {})`
it('calling run with a promise which rejects', async () => {
  const {promise, reject} = deferred();
  const {result} = renderHook(() => useAsync());
  expect(result.current.status).toBe('idle');
  const error = new Error('test error')
  let caughtError;
  act(() => {
    result.current.run(promise).catch(e => caughtError = e);
  })

  expect(result.current.status).toBe('pending');

  await act(async () => {
    reject(error);
  });

  expect(result.current.status).toBe('rejected');
  expect(caughtError).toBe(error);
});

// test.todo('can specify an initial state')
// 💰 useAsync(customInitialState)
it('can specify an initial state', async () => {
  const data = { test: 'data' };
  const customInitialState = {
    status: 'random',
    data,
    error: 'this can be set too',
  }
  const {result} = renderHook(() => useAsync(customInitialState));

  expect(result.current.status).toBe(customInitialState.status);
  expect(result.current.data).toEqual(data);
  expect(result.current.error).toBe(customInitialState.error);
})

// test.todo('can set the data')
// 💰 result.current.setData('whatever you want')
it('can set the data', async () => {
  const dataToSet = { test: 'data' };
  const {result} = renderHook(() => useAsync());

  act(() => {
    result.current.setData(dataToSet);
  });

  expect(result.current.data).toEqual(dataToSet);
});

// test.todo('can set the error')
// 💰 result.current.setError('whatever you want')
it('can set the error', () => {
  const err = new Error('test error');
  const {result} = renderHook(() => useAsync());

  act(() => {
    result.current.setError(err);
  });
  
  expect(result.current.error).toEqual(err);
});

// test.todo('No state updates happen if the component is unmounted while pending')
// 💰 const {result, unmount} = renderHook(...)
// 🐨 ensure that console.error is not called (React will call console.error if updates happen when unmounted)
it('No state updates happen if the component is unmounted while pending', async () => {
  const consoleErrorSpy = jest.spyOn(console, 'error');
  const {result, unmount} = renderHook(() => useAsync());
  const {promise, resolve} = deferred();

  act(() => {
    result.current.run(promise).catch(err => console.error(err));
  });

  // 🐨 assert that result.current is the correct pending state
  expect(result.current.status).toBe('pending');

  act(() => {
    unmount();
  });

  await act(async () => {
    await resolve();
  });  

  expect(consoleErrorSpy).not.toHaveBeenCalled();
});

// test.todo('calling "run" without a promise results in an early error')
it('calling "run" without a promise results in an early error', () => {
  const naughtyPromise = () => {};
  const {result} = renderHook(() => useAsync());
  let thrownError;

  act(() => {
    try {
      result.current.run(naughtyPromise);
    } catch (e) {
      thrownError = e;
    }
  }); 

  expect(thrownError).not.toBeUndefined();
});

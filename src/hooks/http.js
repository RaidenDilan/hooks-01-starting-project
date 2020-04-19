// CUSTOM HOOK
// - Must start with 'use' then call it anything.
import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  indentifier: null
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        indentifier: action.indentifier
      };
    case 'RESPONSE':
      return {
        ...curHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Should not be reached!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback((url, method, body, reqExtra, reqIndentifier) => {
    dispatchHttp({ type: 'SEND', indentifier: reqIndentifier });
    // return fetch(url, {
    fetch(url, {
      method: method,
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(responseData => dispatchHttp({ type: 'RESPONSE', responseData: responseData, extra: reqExtra }))
      .catch(err => dispatchHttp({ type: 'ERROR', errorMsg: err.message }));
  }, []);

  return {
    clear: clear,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    isLoading: httpState.loading,
    reqIndentifier: httpState.indentifier
  };
};

export default useHttp;

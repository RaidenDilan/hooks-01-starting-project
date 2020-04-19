
import { useReducer, useCallback } from 'react';
// CUSTOM HOOK
// - Must start with 'use' then call it anything.

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null, data: null };
    case 'RESPONSE':
      return { ...curHttpState, loading: false, data: action.resData };
    case 'ERROR':
      return { loading: false, error: action.errorMsg };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw new Error('Should not reach this point!!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null
  });

  const sendRequest = useCallback((url, method, body) => {
    dispatchHttp({ type: 'SEND' });
    fetch(url, {
      method: method,
      body: body,
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        dispatchHttp({ type: 'RESPONSE', resData: res });
      })
      .catch((err) => {
        dispatchHttp({ type: 'ERROR', errorMsg: err.message });
      });
  }, []);

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest
  };
};

export default useHttp;

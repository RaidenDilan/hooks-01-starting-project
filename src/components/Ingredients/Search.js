import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';
import './Search.css';

const Search = React.memo(props => {
  Search.displayName = 'Search';

  const { onLoadIngredients } = props; // Object Destrucuring
  const [enteredFilter, setEnteredFilter] = useState(''); // Array Destrucuring
  const inputRef = useRef();
  const { isLoading, error, data, sendRequest, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0
          ? ''
          : `?orderBy="title"&equalTo="${ enteredFilter }"`;
        sendRequest(
          'https://react-hooks-update-616c5.firebaseio.com/ingredients.json' + query,
          'GET'
        );
        // You could make sendRequest to return a promise by add return in front of the fetch method inside the sendRequest function.
        // Then here we can also use the Promise chain.
        // .then(() => {})
        // .catch(() => {})
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [data, isLoading, error, onLoadIngredients]);

  return (
    <section className='search'>
      { error && <ErrorModal onClose={ clear }>{ error }</ErrorModal> }
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          { isLoading && <span>Loading...</span> }
          <input
            ref={ inputRef }
            type='text'
            value={ enteredFilter }
            onChange={ event => {
              setEnteredFilter(event.target.value);
            } } />
        </div>
      </Card>
    </section>
  );
});

export default Search;

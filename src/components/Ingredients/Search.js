import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  Search.displayName = 'Search';

  const { onLoadIngredients } = props; // Object Destrucuring
  const [enteredFilter, setEnteredFilter] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0
          ? ''
          : `?orderBy="title"&equalTo="${ enteredFilter }"`;
        fetch('https://react-hooks-update-616c5.firebaseio.com/ingredients.json' + query)
          .then((res) => res.json())
          .then((resData) => {
            const loadedIngredients = [];
            for (const key in resData) {
              loadedIngredients.push({
                id: key,
                title: resData[key].title,
                amount: resData[key].amount
              });
            }
            onLoadIngredients(loadedIngredients);
          });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]); // Only re run this useEffect if the value of the two arguements change. Else re-run the fetch api

  return (
    <section className='search'>
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          <input
            ref={ inputRef }
            type='text'
            value={ enteredFilter }
            onChange={ event => setEnteredFilter(event.target.value) } />
        </div>
      </Card>
    </section>
  );
});

export default Search;

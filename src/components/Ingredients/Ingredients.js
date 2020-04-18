import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

// function Ingredients() {}
const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]); // pass in an array since we are creating a list
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  /** @note  Used like this, useEffect() acts likes componentDidUpdate: it runs the function AFTER EVERY component update (re-render). */
  useEffect(() => {
    fetch('https://react-hooks-update-616c5.firebaseio.com/ingredients.json')
      .then((res) => res.json())
      .then((resData) => {
        const loadedIngredients = [];
        for (const key in resData) {
          loadedIngredients.push({ id: key, title: resData[key].title, amount: resData[key].amount });
        }
        setUserIngredients(loadedIngredients);
      });
  }, []); /** @note Used like this, (with [] as a second arguement), useEffect() acts like componentDidMount: it runs ONLY ONCE (after the first render). */

  useEffect(() => {
    // runs twice
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []); // this function has no dependencies, we leave an empty arr - []

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-update-616c5.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => {
        setIsLoading(false);
        return res.json();
      })
      .then((resData) => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: resData.name, ...ingredient }
        ]);
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);
    fetch(`https://react-hooks-update-616c5.firebaseio.com/ingredients/${ ingredientId }.jon`, {
      method: 'DELETE'
    })
      .then(() => {
        setIsLoading(false);
        setUserIngredients(prevIngredients => prevIngredients.filter((ingredient) => ingredient.id !== ingredientId));
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
        // setError('Something went wrong ');
      });
  };

  const clearError = () => {
    // These two steps in the then block are synchronized which are executed at the same time.
    setError(null);
    // setIsLoading(false);
    // Then React batches these 2 state updates.
    // Which means it will render once and which updates both states.
  };

  return (
    <div className='App'>
      { error && <ErrorModal onClose={ clearError }>{ error }</ErrorModal> }
      <IngredientForm
        onAddIngredient={ addIngredientHandler }
        loading={ isLoading } />

      <section>
        <Search onLoadIngredients={ filteredIngredientsHandler } />
        <IngredientList
          ingredients={ userIngredients }
          onRemoveItem={ removeIngredientHandler } />
      </section>
    </div>
  );
};

export default Ingredients;

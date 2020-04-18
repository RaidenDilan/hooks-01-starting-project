import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

/**
 * [ingredientReducer description]
 * @param  {[array]} currentIngredients [our current ingredients or better yet our state]
 * @param  {[object]} action            [action]
 */
const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient]; // old array + new item
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there');
  }
};

// function Ingredients() {}
const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // /** @note  Used like this, useEffect() acts likes componentDidUpdate: it runs the function AFTER EVERY component update (re-render). */
  // useEffect(() => {
  //   fetch('https://react-hooks-update-616c5.firebaseio.com/ingredients.json')
  //     .then((res) => res.json())
  //     .then((resData) => {
  //       const loadedIngredients = [];
  //       for (const key in resData) {
  //         loadedIngredients.push({ id: key, title: resData[key].title, amount: resData[key].amount });
  //       }
  //     });
  // }, []); /** @note Used like this, (with [] as a second arguement), useEffect() acts like componentDidMount: it runs ONLY ONCE (after the first render). */

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients); // runs twice
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // When working with useReducer(), React will re-render the component whenever your reducer returns a new state.
    dispatch({ type: 'SET', ingredients: filteredIngredients });
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
        return dispatch({ type: 'ADD', ingredient: { id: resData.name, ...ingredient } });
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);
    fetch(`https://react-hooks-update-616c5.firebaseio.com/ingredients/${ ingredientId }.json`, {
      method: 'DELETE'
    })
      .then(() => {
        setIsLoading(false);
        dispatch({ type: 'DELETE', id: ingredientId });
      })
      .catch((err) => {
        setError(err.message); // setError('Something went wrong ');
        setIsLoading(false);
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

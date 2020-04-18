import React, { useReducer, useEffect, useCallback } from 'react';

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
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient]; // old array + new item
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not reach this point!');
  }
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...curHttpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMsg };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw new Error('Should not reach this point!!');
  }
};

// function Ingredients() {}
const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, []);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients); // runs twice
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // When working with useReducer(), React will re-render the component whenever your reducer returns a new state.
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []); // this function has no dependencies, we leave an empty arr - []

  const addIngredientHandler = ingredient => {
    dispatchHttp({ type: 'SEND' });
    fetch('https://react-hooks-update-616c5.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => {
        dispatchHttp({ type: 'RESPONSE' });
        return res.json();
      })
      .then((resData) => {
        return dispatch({
          type: 'ADD',
          ingredient: { id: resData.name, ...ingredient }
        });
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    dispatchHttp({ type: 'SEND' });
    fetch(`https://react-hooks-update-616c5.firebaseio.com/ingredients/${ ingredientId }.json`, {
      method: 'DELETE'
    })
      .then(() => {
        dispatchHttp({ type: 'RESPONSE' });
        dispatch({ type: 'DELETE', id: ingredientId });
      })
      .catch((err) => dispatchHttp({ type: 'ERROR', errorMsg: err.message }));
  };

  const clearError = () => {
    dispatchHttp({ type: 'CLEAR' });
  };

  return (
    <div className='App'>
      { httpState.error && <ErrorModal onClose={ clearError }>{ httpState.error }</ErrorModal> }
      <IngredientForm
        onAddIngredient={ addIngredientHandler }
        loading={ httpState.loading } />

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

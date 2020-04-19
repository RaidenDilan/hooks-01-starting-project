import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

import useHttp from '../../hooks/http';

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

// function Ingredients() {}
const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, error, data, sendRequest } = useHttp();

  useEffect(() => {
    // sendRequest('https://react-hooks-update-616c5.firebaseio.com/ingredients.json', 'GET', userIngredients);
    // console.log('RENDERING INGREDIENTS', userIngredients); // runs twice
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // When working with useReducer(), React will re-render the component whenever your reducer returns a new state.
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []); // this function has no dependencies, we leave an empty arr - []

  // using the useCallback hook will not re-render our IngredientForm component because it's an old function, therefore it doesn't rebuild the component.
  const addIngredientHandler = useCallback(ingredient => {
    sendRequest('https://react-hooks-update-616c5.firebaseio.com/ingredients.json', 'POST', ingredient);
    // dispatchHttp({ type: 'SEND' });
    // fetch('https://react-hooks-update-616c5.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json' }
    // })
    //   .then((res) => {
    //     // dispatchHttp({ type: 'RESPONSE' });
    //     return res.json();
    //   })
    //   .then((resData) => {
    //     return dispatch({
    //       type: 'ADD',
    //       ingredient: { id: resData.name, ...ingredient }
    //     });
    //   });
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(`https://react-hooks-update-616c5.firebaseio.com/ingredients/${ ingredientId }.json`, 'DELETE');
  }, [sendRequest]);

  const clearError = useCallback(() => {

  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ userIngredients }
        onRemoveItem={ removeIngredientHandler } />
    );
  }, [removeIngredientHandler, userIngredients]);

  return (
    <div className='App'>
      { error && <ErrorModal onClose={ clearError }>{ error }</ErrorModal> }
      <IngredientForm
        onAddIngredient={ addIngredientHandler }
        loading={ isLoading } />

      <section>
        <Search onLoadIngredients={ filteredIngredientsHandler } />
        { ingredientList }
      </section>
    </div>
  );
};

export default Ingredients;

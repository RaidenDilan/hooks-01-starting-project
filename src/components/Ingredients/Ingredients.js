import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

// function Ingredients() {}
const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]); // pass in an array since we are creating a list

  /** @note  Used like this, useEffect() acts likes componentDidUpdate: it runs the function AFTER EVERY component update (re-render). */
  useEffect(() => {
    fetch('https://react-hooks-update-616c5.firebaseio.com/ingredients.json')
      .then((res) => res.json())
      .then((resData) => {
        const loadedIngreients = [];
        for (const key in resData) {
          loadedIngreients.push({
            id: key,
            title: resData[key].title,
            amount: resData[key].amount
          });
        }
        setUserIngredients(loadedIngreients);
      });
  }, []); /** @note Used like this, (with [] as a second arguement), useEffect() acts like componentDidMount: it runs ONLY ONCE (after the first render). */

  useEffect(() => {
    // runs twice
    console.log('RENDERING INGREIDNETS', userIngredients);
  }, [userIngredients]);

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-update-616c5.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((resData) => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: resData.name, ...ingredient }
        ]);
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setUserIngredients(prevIngredients => prevIngredients.filter((ingredient) => ingredient.id !== ingredientId));
  };

  return (
    <div className='App'>
      <IngredientForm onAddIngredient={ addIngredientHandler } />

      <section>
        <Search />
        <IngredientList ingredients={ userIngredients } onRemoveItem={ removeIngredientHandler } />
      </section>
    </div>
  );
};

export default Ingredients;

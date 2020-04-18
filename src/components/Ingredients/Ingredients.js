import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

// function Ingredients() {}
const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]); // pass in an array since we are creating a list

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

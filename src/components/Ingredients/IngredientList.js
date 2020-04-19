import React from 'react';

import './IngredientList.css';

/*
 * If your function component renders the same result given the same props, you can wrap it in a call
 * to React.memo for a performance boost in some cases by memoizing the result.
 * This means that React will skip rendering the component, and reuse the last rendered result.
 * React.memo only checks for prop changes. If your function component wrapped in React.memo has a useState
 * or useContext Hook in its implementation, it will still rerender when state or context change.
 */

const IngredientList = React.memo(props => {
  IngredientList.displayName = 'IngredientList';
  
  return (
    <section className='ingredient-list'>
      <h2>Loaded Ingredients</h2>
      <ul>
        { props.ingredients.map(ig => (
          <li
            key={ ig.id }
            onClick={ props.onRemoveItem.bind(this, ig.id) }>
            <span>{ ig.title }</span>
            <span>{ ig.amount }x</span>
          </li>
        )) }
      </ul>
    </section>
  );
});

export default IngredientList;

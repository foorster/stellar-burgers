// Компонент, который отображает подробную информацию об ингредиенте
// на основе его ID, полученного из параметров URL (Модалка при тыке)

import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details'; // Отображает фактическую информацию об ингредиенте
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIngredientsSelector } from '../../services/ingredients/slice'; // Для получения списка ингредиентов из редакс store
import styles from '../app/app.module.css';

export const IngredientDetails: FC = () => {
  const ingredients = useSelector(getIngredientsSelector); // Получил список ингридиентов из стора
  const { id } = useParams(); // Получил ID ингредиента из параметров URL
  const ingredientData = ingredients.find((item) => item._id === id); //  Ищем

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <div className={styles.detailPageWrap}>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};

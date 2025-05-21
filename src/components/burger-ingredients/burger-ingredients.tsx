import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { Preloader } from '@ui';
import { getIngredientState } from '../../services/ingredients/slice';

// Компонент для отображения ингредиентов бургера
export const BurgerIngredients: FC = () => {
  // Получаем состояние ингредиентов из Redux
  const { ingredients, loading, error } = useSelector(getIngredientState);

  // Состояние для хранения активной вкладки (bun, sauce, main)
  const [activeTab, setActiveTab] = useState<TTabMode>('bun');

  // Ref для заголовков секций (bun, main, sauce) для скролла к ним
  const bunRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLHeadingElement>(null);
  const sauceRef = useRef<HTMLHeadingElement>(null);

  // Ref и хук useInView для отслеживания видимости заголовков секций
  const [bunInViewRef, bunInView] = useInView({ threshold: 0 }); // threshold: 0 - как только элемент появляется, он считается видимым
  const [mainInViewRef, mainInView] = useInView({ threshold: 0 });
  const [sauceInViewRef, sauceInView] = useInView({ threshold: 0 });

  // Фильтруем ингредиенты по типу (bun, main, sauce)
  const filteredIngredients = {
    buns: ingredients.filter((i) => i.type === 'bun'),
    mains: ingredients.filter((i) => i.type === 'main'),
    sauces: ingredients.filter((i) => i.type === 'sauce')
  };

  // useEffect для обновления активной вкладки при изменении видимости заголовков секций
  useEffect(() => {
    if (bunInView)
      setActiveTab('bun'); // Если заголовок булочек виден, делаем активной вкладку "bun"
    else if (sauceInView)
      setActiveTab('sauce'); // Если заголовок соусов виден, делаем активной вкладку "sauce"
    else if (mainInView) setActiveTab('main'); // Если заголовок начинок виден, делаем активной вкладку "main"
  }, [bunInView, mainInView, sauceInView]);

  // Обработчик клика по табу
  const handleTabClick = (tab: string) => {
    const tabMode = tab as TTabMode;
    setActiveTab(tabMode); // Устанавливаем активную вкладку

    // Определяем ref для скролла
    const ref =
      tabMode === 'bun' ? bunRef : tabMode === 'main' ? mainRef : sauceRef;

    // Скроллим к выбранному заголовку секции
    ref.current?.scrollIntoView({ behavior: 'smooth' }); // Плавная прокрутка
  };

  // Отображаем прелоадер, если данные загружаются
  if (loading) return <Preloader />;

  // Отображаем сообщение об ошибке, если произошла ошибка
  if (error) return <div>Error: {error}</div>;

  // Отображаем UI компонент с ингредиентами
  return (
    <BurgerIngredientsUI
      currentTab={activeTab} // Активная вкладка
      buns={filteredIngredients.buns} // Булочки
      mains={filteredIngredients.mains} // Начинки
      sauces={filteredIngredients.sauces} // Соусы
      titleBunRef={bunRef} // Ref для заголовка секции булочек
      titleMainRef={mainRef} // Ref для заголовка секции начинок
      titleSaucesRef={sauceRef} // Ref для заголовка секции соусов
      bunsRef={bunInViewRef} // Ref для отслеживания видимости заголовка булочек
      mainsRef={mainInViewRef} // Ref для отслеживания видимости заголовка начинок
      saucesRef={sauceInViewRef} // Ref для отслеживания видимости заголовка соусов
      onTabClick={handleTabClick}
    />
  );
};

import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { Preloader } from '@ui';
import { getIngredientState } from '../../services/ingredients/slice';
import { TConstructorIngredient } from '@utils-types';
export type TIngredient = {
  type: 'bun' | 'sauce' | 'main';
};
export const BurgerIngredients: FC = () => {
  /** TODO: взять переменные из стора */
  const { ingredients, loading, error } = useSelector(getIngredientState);
  const [activeTab, setActiveTab] = useState<TTabMode>('bun');
  const bunRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLHeadingElement>(null);
  const sauceRef = useRef<HTMLHeadingElement>(null);
  const [bunInViewRef, bunInView] = useInView({ threshold: 0 });
  const [mainInViewRef, mainInView] = useInView({ threshold: 0 });
  const [sauceInViewRef, sauceInView] = useInView({ threshold: 0 });

  const filteredIngredients = {
    buns: ingredients.filter((i) => i.type === 'bun'),
    mains: ingredients.filter((i) => i.type === 'main'),
    sauces: ingredients.filter((i) => i.type === 'sauce')
  };

  useEffect(() => {
    if (bunInView) setActiveTab('bun');
    else if (sauceInView) setActiveTab('sauce');
    else if (mainInView) setActiveTab('main');
  }, [bunInView, mainInView, sauceInView]);

  const handleTabClick = (tab: string) => {
    const tabMode = tab as TTabMode;
    setActiveTab(tabMode);
    const ref =
      tabMode === 'bun' ? bunRef : tabMode === 'main' ? mainRef : sauceRef;
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  //return null;
  if (loading) return <Preloader />;
  if (error) return <div>Error: {error}</div>;
  return (
    <BurgerIngredientsUI
      currentTab={activeTab}
      buns={filteredIngredients.buns}
      mains={filteredIngredients.mains}
      sauces={filteredIngredients.sauces}
      titleBunRef={bunRef}
      titleMainRef={mainRef}
      titleSaucesRef={sauceRef}
      bunsRef={bunInViewRef}
      mainsRef={mainInViewRef}
      saucesRef={sauceInViewRef}
      onTabClick={handleTabClick}
    />
  );
};

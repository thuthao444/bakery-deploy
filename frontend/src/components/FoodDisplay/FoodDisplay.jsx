import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import { useTranslation } from 'react-i18next'

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const FoodDisplay = ({ category }) => {

  const { food_list } = useContext(StoreContext)
  const { t } = useTranslation()

  return (
    <div className='food-display' id='food-display'>
      <h2>{t('Our products')}</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
            if(category==="All" || category===item.category){
              return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={formatPrice(parseFloat(item.price))} image={item.image} />
            }
        })}
      </div>
    </div>
  )
}

export default FoodDisplay

import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';
import { Link } from 'react-router-dom';

const maxWords = 5;

const truncateDescription = (description) => {
    const words = description.split(' ');
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    return description;
}

const FoodItem = ({ id, name, price, description, image }) => {

    const {cartItems, addToCart, removeFromCart, url} = useContext(StoreContext);
    const truncatedDescription = truncateDescription(description);

    return (
            <div className='food-item'>
                <div className="food-item-img-container">
                <Link to={`/food/${id}`}><img className="food-item-image" src={url + "/images/"+ image} alt="" /></Link>
                    {!cartItems[id]
                        ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="" />
                        : <div className='food-item-counter'>
                            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                            <p>{cartItems[id]}</p>
                            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
                        </div>
                    }
                </div>
                <div className="food-item-info">
                    <div className="food-item-name-rating">
                        <Link to={`/food/${id}`}>{name}</Link>
                        <img src={assets.rating_starts} alt="" />
                    </div>
                    <p className="food-item-desc">{truncatedDescription}</p>
                    <p className="food-item-price">{price}vnd</p>
                </div>
            </div>
    );
};

export default FoodItem

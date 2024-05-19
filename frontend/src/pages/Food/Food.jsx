import React, { useContext, useEffect, useState } from 'react'
import './Food.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Hàm thêm dấu ngăn cho tiền
const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const Food = () => {

    const { id } = useParams();
    const { cartItems, addToCart, removeFromCart, url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const [averageRating, setAverageRating] = useState(0);

    const fetchFood = async () => {
        const response = await axios.get(url + `/api/food/${id}`);
        if (response.data.success) {
            setData(response.data.data);
            calAverRating(response.data.data.ratings);
        } else {
            console.log("Error")
        }
    }

    useEffect(() => {
        fetchFood()
    })

    const calAverRating = (ratings) => {
        if (ratings && ratings.length > 0) {
            const totalRating = ratings.reduce((acc, rating) => acc + parseInt(rating.rating), 0);
            const avgRating = (totalRating / ratings.length).toFixed(1); // Làm tròn trung bình đánh giá đến 1 chữ số sau dấu phẩy
            setAverageRating(avgRating);
        } else {
            setAverageRating(0);
        }
    }

    const renderStarRating = () => {
        const stars = [];
        const roundedAverage = Math.round(averageRating);
        const integerPart = Math.floor(averageRating);
        const decimalPart = averageRating - integerPart;

        for (let i = 1; i <= integerPart; i++) {
            stars.push(<span key={i} className="star filled">&#9733;</span>);
        }

        if (decimalPart > 0 && decimalPart < 1) {
            stars.push(<span key="half-star" className="half-filled">&#9733;</span>);
        }

        for (let i = stars.length + 1; i <= 5; i++) {
            stars.push(<span key={i} className="star">&#9733;</span>);
        }

        return stars;
    }

    return (
        <div className='food-details'>
            <div className="food-details-container">
                <img className="food-item-img" src={url + "/images/" + data.image} alt="" />
                <div class="descrip">
                    <p class="descrip-name">{data.name}</p>
                    <p className="descrip-category">{data.category}</p>
                    <p class="descrip-description">{data.description}</p>
                    <p className="descrip-price">{formatPrice(parseFloat(data.price))}vnd</p>
                    <div className="add-cart">
                        {!cartItems[id]
                            ? <button className='add-button' onClick={() => addToCart(id)}>Add to Cart</button>
                            : <div className='food-counter'>
                                <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                                <p>{cartItems[id]}</p>
                                <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
                            </div>
                        }
                    </div>
                    <div class="descrip-rate">
                        <p>{averageRating}</p>
                        <div className="star">{renderStarRating()}</div>
                    </div>
                </div>
                <div className='box-rating'>
                    <h2>Ratings:</h2>
                    <div className="comment-container">
                        {data.ratings && data.ratings.length > 0 ? (
                            <ul>
                                {data.ratings.map((rating, index) => (
                                    <li key={index} className='rating-item'>
                                        <p>User ID: <span>{rating.userId}</span></p>
                                        <p>Comment: <span>{rating.comment}</span></p>
                                        <p>Rating: <span id='rating-number'>{rating.rating}<img src={assets.rating_starts}/></span></p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No ratings</p>
                        )}
                    </div>
                </div>
                <div className="recommend-item">
                    <h2>Recommend food for you</h2>
                    <hr />
                </div>
            </div>
        </div>
    )
}

export default Food
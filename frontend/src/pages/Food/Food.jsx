import React, { useContext, useEffect, useState } from 'react'
import './Food.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FoodItem from '../../components/FoodItem/FoodItem';
import { useTranslation } from 'react-i18next'

// Hàm thêm dấu ngăn cho tiền
const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const Food = () => {

    const { id } = useParams();
    const { cartItems, addToCart, removeFromCart, url, token, name } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [fullItem, setFullItem] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const { t } = useTranslation()

    const fetchFood = async () => {
        const response = await axios.get(url + `/api/food/${id}`);
        if (response.data.success) {
            setData(response.data.data);
            calAverRating(response.data.data.ratings);
            fetchRecommendations(response.data.data.name, name);
        } else {
            console.log("Error")
        }
    }

    const fetchRecommendations = async (itemName, userName) => {
        try {
            const response = await axios.get('https://modelai1.onrender.com/recommend/', {
                params: {
                    item_name: itemName,
                    user_name: userName
                }
            });

            if (response.status === 200) {
                setRecommendations(response.data.recommendations);
                fetchItem(response.data.recommendations)
            } else {
                console.log("Error fetching recommendations");
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    // Fetch thông tin các món ăn đề xuất từ API
    const fetchItem = async (list) => {
        const item = []
        for (let i = 0; i < list.length; i++) {
            const response = await axios.get(url + `/api/food/get?name=${list[i]}`)
            if (response.status === 200) {
                item.push(response.data.data)
            } else {
                console.log("Can not find item")
            }
        }
        setFullItem(item)
    }

    useEffect(() => {
        fetchFood();
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        fetchRecommendations();
    }, [id])

    useEffect(() => {
        fetchItem();
    }, [])

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

    const renderStarCmt = (rating) => {
        const stars = [];

        // Thêm ngôi sao đầy đủ tương ứng với giá trị rating
        for (let i = 1; i <= rating; i++) {
            stars.push(<span key={i} className="cmt-stars">&#9733;</span>);
        }

        return stars;
    };

    return (
        <div className='food-details'>
            <div className="food-details-container">
                <img className="food-item-img" src={url + "/images/" + data.image} alt="" />
                <div className="descrip">
                    <p className="descrip-name">{data.name}</p>
                    <p className="descrip-category">{t(`${data.category}`)}</p>
                    <p className="descrip-description">{t(`${data.description}`)}</p>
                    <p className="descrip-price">{formatPrice(parseFloat(data.price))}vnd</p>
                    <div className="add-cart">
                        {!cartItems[id]
                            ? <button className='add-button' onClick={() => addToCart(id)}>{t('Add to cart')}</button>
                            : <div className='food-counter'>
                                <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                                <p>{cartItems[id]}</p>
                                <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
                            </div>
                        }
                    </div>
                    <div className="descrip-rate">
                        <p>{averageRating}
                            <span>/5</span>
                        </p>
                        <div className="star">{renderStarRating()}</div>
                    </div>
                </div>
            </div>
            <div className='box-rating'>
                <h2>{t('Ratings')}:</h2>
                <div className="comment-container">
                    {data.ratings && data.ratings.length > 0 ? (
                        <ul>
                            {data.ratings.map((rating, index) => (
                                <li key={index} className='rating-item'>
                                    <p>{t('User ID:')} <span>{rating.userId}</span></p>
                                    <p>{t('Comment')}: <span>{rating.comment}</span></p>
                                    <p>{t('Rating')}: <span id='rating-number'>{renderStarCmt(rating.rating)}</span></p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>{t('No ratings')}</p>
                    )}
                </div>
            </div>
            <div className="recommend-item">
                <h2>{t('Recommend food for you')}</h2>
                <hr />
                <div className="recommend-list">
                    {fullItem.length > 0 ? (
                        fullItem.map((food) => (
                            <FoodItem
                                key={food._id}
                                id={food._id}
                                name={food.name}
                                price={food.price}
                                description={food.description}
                                image={food.image}
                            />
                        ))
                    ) : (
                        <p>{t('No recommendations available')}</p>
                    )}
                </div>
            </div>
        </div>
    )
};

export default Food
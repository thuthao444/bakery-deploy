import React, { useContext, useEffect, useState } from 'react'
import './Food.css'
import { StoreContext } from '../../context/StoreContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Food = () => {

    const { id } = useParams();
    const {cartItems, addToCart, removeFromCart, url, token} = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [rating, setRating] = useState({
        comment: "",
        rate: "",
    });

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

    useEffect (() => {
        fetchFood()
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setRating (rating => ({...rating, [name]: value}))
    }

    const comment = async (event) => {
        event.preventDefault();

        let ratingData = {
            comment: rating.comment,
            rating: rating.rate
        }

        let response = await axios.post(url + `/api/food/${id}`, ratingData, {headers: {token}});
        if (response.data.success) {
            fetchFood()
        } else {
            console.log("Error")
        }
    }

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
    <div className='food'>
        <div className="container">
        <img className="food-item-img" src={url + "/images/"+ data.image} alt="" />
            <div class="descrip">
                <p class="name">{data.name}</p>
                <p class="price">{data.price}vnd</p>
                <p>Description:</p>
                <p class="description">{data.description}</p>
                <p className="category">Catogory: {data.category}</p>
                <div class="rate">
                    <p>{averageRating}</p>
                    <div className="star">{renderStarRating()}</div>
                </div>

            </div>
        </div>
        <br />
        <br />
        <div>
            <h4>Ratings:</h4>
            {data.ratings && Object.keys(data.ratings).length > 0 ? (
                <ul>
                    {data.ratings.map((rating, index) => (
                        <li key={index}>
                            <p>User ID: {rating.userId}</p>
                            <p>Comment: {rating.comment}</p>
                            <p>Rating: {rating.rating}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No ratings available</p>
            )}
        </div>
        <form onSubmit={comment} className='place-order'>
            <div className="place-order-left">
                <p className="title">Comment</p>
                <div className="multi-fields">
                <input required name='comment' onChange={ onChangeHandler } value={ rating.comment } type="text" placeholder='comment' />
                <input required name='rate' onChange={ onChangeHandler } value={ rating.rate } type="number" placeholder='rate' />
                </div>
                <button type='submit'>Comment</button>
            </div>
        </form>
    </div>
  )
}

export default Food
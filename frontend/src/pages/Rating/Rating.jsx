import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './Rating.css'
import { StoreContext } from '../../context/StoreContext';

const Rating = () => {
    const { url, token } = useContext(StoreContext);
    const { state } = useLocation(); 
    const [items] = useState(state ? state.items : []); 
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [rating, setRating] = useState({
        comment: "",
        rate: "",
    });

    const { orderId } = useParams();
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setRating(rating => ({...rating, [name]: value}));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const item = items[currentItemIndex]; 

        let ratingData = {
            comment: rating.comment,
            rating: rating.rate
        }

        try {
            const response = await axios.post(`${url}/api/food/${item._id}`, ratingData, { headers: { token } });

            if (response.data.success) {
                if (currentItemIndex < items.length - 1) {
                    setCurrentItemIndex(currentItemIndex + 1);
                } else {
                    updateOrderRatedStatus();
                    navigate('/myorders');
                }
            } else {
                console.error('Error submitting rating');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const updateOrderRatedStatus = async () => {
        try {
            await axios.put(`${url}/api/order/${orderId}`);
        } catch (error) {
            console.error('Error updating rated status:', error);
        }
    };

    if (!items || items.length === 0) { 
        return <div>Loading...</div>;
    }

    const currentItem = items[currentItemIndex];

    return (
        <div className='rating'>
            <div className="rating-box">
            <h2 className='rating-title'>Rating for {currentItem.name}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="rating-group">
                        <label>Comment:</label>
                        <input required name='comment' onChange={onChangeHandler} value={rating.comment} type="text" placeholder='comment' />
                    </div>
                    <div className="rating-group">
                        <label htmlFor="">Rating:</label>
                        <input required name='rate' onChange={onChangeHandler} value={rating.rate} min="1" max="5" type="number" placeholder='rate' />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Rating;

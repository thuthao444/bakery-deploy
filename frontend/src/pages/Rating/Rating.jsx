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
        rate: 0,
    });

    const { orderId } = useParams();
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setRating(rating => ({ ...rating, [name]: value }));
    }

    const handleRatingClick = (rate) => {
        setRating({ ...rating, rate });
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
                <form onSubmit={handleSubmit}>
                    <div className="rating-group">
                        <label className='title'>Rating for {currentItem.name}</label>
                        <input required name='comment' onChange={onChangeHandler} value={rating.comment} type="text" placeholder='comment' />
                    </div>
                    <div className="rating-group">
                        <label htmlFor="">Rating:</label>
                        <div className="rating-icons">
                            {[1, 2, 3, 4, 5].map((rate) => (
                                <span
                                    key={rate}
                                    className={`rating-icon ${rating.rate === rate ? 'selected' : ''}`}
                                    onClick={() => handleRatingClick(rate)}
                                >
                                    {getEmojiForRating(rate)}
                                </span>
                            ))}
                        </div>
                    </div>
                    <button className='submit-btn' type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

const getEmojiForRating = (rate) => {
    switch (rate) {
        case 1: return '😞';
        case 2: return '😟';
        case 3: return '😐';
        case 4: return '🙂';
        case 5: return '😁';
        default: return '';
    }
}

export default Rating;


import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const MyOrders = () => {

    const {url, token} = useContext(StoreContext);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation()

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, {headers:{token}});
        setData(response.data.data);
    }

    useEffect (() => {
        if (token) {
            fetchOrders();
        }
    }, [token])

    const handleRatingClick = (orderId, items) => {
        navigate(`/rating/${orderId}`, { state: { items } }); 
    };

  return (
    <div className='my-orders'>
        <h2>{t('My Orders')}</h2>
        <div className="container">
            {data.map((order, index) => {
                const isRated = order.rated === true;
                return (
                    <div key={index} className="my-orders-order">
                        <img src="assets.parcel_icon" alt="" />
                        <p>{order.items.map((item, index) => {
                            if (index === order.items.length-1) {
                                return item.name + " x " + item.Quantity
                            } else {
                                return item.name + " x " + item.Quantity + ", "
                            }
                        })}</p>
                        <p>{formatPrice(parseFloat(order.amount))}đ</p>
                        <p>{t('Items:')} {order.items.length}</p>
                        <p><span>&#x25cf;</span><b>{order.status}</b></p>
                        {order.status === 'Delivered' && (
                                order.rated ? (
                                    <div className="complete-box">{t('Completed')}</div>
                                ) : (
                                    <button onClick={() => handleRatingClick(order._id, order.items)} className={order.rated ? 'rated' : ''}>{t('Rating')}</button>
                                )
                        )}
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default MyOrders

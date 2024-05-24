import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext)

  const navigate = useNavigate();

  const { t } = useTranslation()

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>{t('Items')}</p>
          <p>{t('Title')}</p>
          <p>{t('Price')}</p>
          <p>{t('Quantity')}</p>
          <p>{t('Total')}</p>
          <p>{t('Remove')}</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) // kiem tra xem co san pham nao co id trong gio hang khong
          {
            return (
              <div>
                <div className="cart-items-title cart-items-item" >
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{formatPrice(parseFloat(item.price))}đ</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{formatPrice(parseFloat(item.price * cartItems[item._id]))}đ</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      <div>
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>{t('Cart Totals')}</h2>
            <div>
              <div className="cart-total-details">
                <p>{t('Subtotal')}</p>
                <p>{formatPrice(parseFloat(getTotalCartAmount()))}đ</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>{t('Delivery Fee')}</p>
                <p>{formatPrice(parseFloat(getTotalCartAmount() === 0 ? 0 : 15000))}đ</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>{t('Total')}</b>
                <b>{formatPrice(parseFloat(getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 15000))}đ</b>
              </div>
            </div>
            <button onClick={() => navigate('/order')}>{t('PROCEED TO CHECKOUT')}</button>
          </div>
          <div className="cart-promocode">
            <div>
              <p>{t('if you have a promocode, Enter it here')}</p>
              <div className='cart-promocode-input'>
                <input type="text" placeholder='promocode' />
                <button>{t('Submit')}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

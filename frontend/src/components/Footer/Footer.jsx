import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { useTranslation } from 'react-i18next'

const Footer = () => {
    const { t } = useTranslation()
  return (
    <div className='footer' id='footer'>
    <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>{t('Yumm! Bakery: Crafting sweet moments since 2024. Discover our delightful pastries, cakes, and more. Savor the taste of perfection with every bite.')}</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
        <h2>{t('COMPANY')}</h2>
        <ul>
            <li>{t('Home')}</li>
            <li>{t('About us')}</li>
            <li>{t('Delivery')}</li>
            <li>{t('Privacy policy')}</li>
        </ul>
        </div>   
        <div className="footer-content-right">
            <h2>{t('GET IN TOUCH')}</h2>
            <ul>
                <li>+84-49084611</li>
                <li>vttt@vnu.edu.vn</li>
            </ul>
        </div>
    </div>
    <hr />
    <p className="footer-copyright">{t('Copy right 2024 © VTTT.com - All Right Reserved.')}</p>
    </div>
  )
}

export default Footer

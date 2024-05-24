import React from 'react'
import './Header.css'
import { useTranslation } from 'react-i18next'

const Header = () => {
  const { t } = useTranslation()
  return (
    <div className='header'>
      <div className="header-contents">
        <h2>{t('title-home')}</h2>
        <p>{t('text-home')}</p>
        <button>{t('view menu')}</button>
      </div>
    </div>
  )
}

export default Header

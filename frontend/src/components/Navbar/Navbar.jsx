import React, { useContext, useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext.jsx';
import axios from 'axios';
import { assets } from '../../assets/assets.js';
import { useTranslation } from 'react-i18next';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("menu");
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const { url, getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Drop tìm kiếm
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (searchTerm.trim() !== '') {
                    const response = await axios.get(`${url}/api/food/search?search=${searchTerm}`);
                    const data = response.data.data;
                    setSuggestions(data);
                    setShowDropdown(true);
                } else {
                    setSuggestions([]);
                    setShowDropdown(false);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [searchTerm]);

    // Ẩn dropdown khi click bên ngoài.
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);


    useEffect(() => {
        setShowDropdown(false);
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

    // Chuyển hướng đến trang tìm kiếm
    const handleSearch = () => {
        if (searchTerm.trim() !== '') {
            navigate(`/search?search=${searchTerm}`);
        }
    };

    // Click vào item thì chuyển đến trang chi tiết sản phẩm
    const handleSuggestionClick = (id) => {
        navigate(`/food/${id}`);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Hàm thay đổi trạng thái thanh tìm kiếm khi thay đổi kích thước màn hình
    const toggleSearch = () => {
        const navbarSearch = document.querySelector('.navbar-search');
        navbarSearch.style.display = navbarSearch.style.display === 'none' ? 'block' : 'none';
    };

    const changeLanguage = (lng) => {
        if (lng === 'en' || lng === 'vi') {
            i18n.changeLanguage(lng);
        } else {
            console.error('Invalid language:', lng);
        }
    };       

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className='navbar'>
            <Link to=''><img src={assets.logo} alt="" className="logo" /></Link>
            <ul className="navbar-menu">
                <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>{t('home')}</Link>
                <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>{t('menu')}</a>
                <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>{t('contact')}</a>
            </ul>
            <div className="navbar-right">
                <div className="dropdown-translation">
                    <button className="dropbtn"><img src={assets.translation_icon} alt="" /></button>
                    <div className="dropdown-content">
                        <button onClick={() => changeLanguage('en')}>{t('English')}</button>
                        <button onClick={() => changeLanguage('vi')}>{t('Vietnamese')}</button>
                    </div>
                </div>
                <div className="sub-search-icon" onClick={toggleSearch}>
                    <img src={assets.search_icon} alt="Search" />
                </div>
                <div className="navbar-search" ref={dropdownRef}>
                    <input
                        type="text"
                        placeholder={t('search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setShowDropdown(true)}
                    />
                    {showDropdown && suggestions.length > 0 && (
                        <div className="suggestions-dropdown">
                            {suggestions.map((product, index) => (
                                <div
                                    key={index}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(product._id)}
                                >
                                    <span className='name'>{product.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <button className="search-btn" onClick={handleSearch}><img src={assets.search_icon} alt="" /></button>
                </div>
                <div className="navbar-basket">
                    <Link to='/cart'><img src={assets.basket_icon} alt="" className="" /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>
                {!token ? <button className="sign-btn" onClick={() => setShowLogin(true)}>{t('sign in')}</button>
                    : <div className='navbar-profile'>
                        <img src={assets.profile_icon} alt="" />
                        <ul className='nav-profile-dropdown'>
                            <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>{t('orders')}</p></li>
                            <hr />
                            <li onClick={() => navigate('/profile')}><img src={assets.prf_icon} alt="" /><p>{t('profile')}</p></li>
                            <hr />
                            <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>{t('logout')}</p></li>
                        </ul>
                    </div>}
            </div>
        </div>
    );
};

export default Navbar;

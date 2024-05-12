// import React, { useContext, useState } from 'react'
// import './Navbar.css'
// import { assets } from '../../assets/assets'
// import { Link, useNavigate } from 'react-router-dom';
// import { StoreContext } from '../../context/StoreContext.jsx';

// const Navbar = ({ setShowLogin }) => {

//     const [menu, setMenu] = useState("menu");

//     const { getTotalCartAmount, token, setToken} = useContext(StoreContext); // lay gia tri tu context

//     const navigate = useNavigate();

//     const logout = () => {
//         localStorage.removeItem("token");
//         setToken("");
//         navigate("/")
//     }

//     return (
//         <div className='navbar'>
//             <Link to=''><img src={assets.logo} alt="" className="logo" /></Link>
//             <ul className="navbar-menu">
//                 <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
//                 <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
//                 <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile app</a>
//                 <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</a>
//             </ul>
//             <div className="navbar-right">
//                 <Link to='/search'><img src={assets.search_icon} alt="" className="" /></Link>
//                 <div className="navbar-search-icon">
//                     <Link to='/cart'><img src={assets.basket_icon} alt="" className="" /></Link>
//                     <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
//                 </div>
//                 {!token?<button onClick={() => setShowLogin(true)}>sign in</button>
//                 :<div className='navbar-profile'>
//                     <img src={assets.profile_icon} alt="" />
//                     <ul className='nav-profile-dropdown'>
//                         <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
//                         <hr />
//                         <li onClick={() => navigate('/profile')}>Profile</li>
//                         <hr />
//                         <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
//                     </ul>
//                 </div>}
//             </div>
//         </div >
//     )
// }

// export default Navbar


import React, { useContext, useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext.jsx';
import { assets } from '../../assets/assets.js';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("menu");
    const [searchTerm, setSearchTerm] = useState('');
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

    const handleSearch = () => {
        if (searchTerm.trim() !== '') {
            navigate(`/search?search=${searchTerm}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleSearch = () => {
        const navbarSearch = document.querySelector('.navbar-search');
        navbarSearch.style.display = navbarSearch.style.display === 'none' ? 'block' : 'none';
    };

    return (
        <div className='navbar'>
            <Link to=''><img src={assets.logo} alt="" className="logo" /></Link>
            <ul className="navbar-menu">
                <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
                <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
                <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile app</a>
                <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</a>
            </ul>
            <div className="navbar-right">
                <div className="sub-search-icon" onClick={toggleSearch}>
                    <img src={assets.search_icon} alt="Search" />
                </div>
                <div className="navbar-search">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="search-btn" onClick={handleSearch}><img src={assets.search_icon} alt="" /></button>
                </div>
                <div className="navbar-basket">
                    <Link to='/cart'><img src={assets.basket_icon} alt="" className="" /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>
                {!token ? <button className="sign-btn" onClick={() => setShowLogin(true)}>sign in</button>
                    : <div className='navbar-profile'>
                        <img src={assets.profile_icon} alt="" />
                        <ul className='nav-profile-dropdown'>
                            <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                            <hr />
                            <li onClick={() => navigate('/profile')}><img src={assets.prf_icon} alt="" /><p>Profile</p></li>
                            <hr />
                            <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
                        </ul>
                    </div>}
            </div>
        </div>
    );
};

export default Navbar;
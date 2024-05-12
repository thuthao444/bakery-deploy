import React, { useContext, useState, useEffect } from 'react';
import './Search.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import FoodItem from '../../components/FoodItem/FoodItem';
import { useLocation } from 'react-router-dom'; // Import useLocation

const Search = () => {
    const { url } = useContext(StoreContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [noFoodFound, setNoFoodFound] = useState(false);
    const location = useLocation(); // Lấy location

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const term = searchParams.get('search');
        setSearchTerm(term);
        handleSearch(term);
    }, [location.search]);

    const handleSearch = async (term) => { // Thêm tham số term vào hàm handleSearch
        try {
            const response = await axios.get(`${url}/api/food/search?search=${term}`);
            const data = response.data.data;
            if (data.length === 0) {
                setNoFoodFound(true);
            } else {
                setSearchResult(data);
                setNoFoodFound(false);
            }
        } catch (error) {
            console.error('Error searching for food:', error);
        }
    };

    return (
        <div className='search-container'>
            <div className="search-results">
                {noFoodFound ? (
                    <div className="not-found">Food item search unsuccessful <br /> Please try again!</div>
                ) : (
                    <div>
                        <h2 className="food-search-title">Search results</h2>
                        <div className="food-search-list">
                            {searchResult.map((food) => (
                                <div key={food._id} className="food-item-wrapper">
                                    <FoodItem
                                        id={food._id}
                                        name={food.name}
                                        price={food.price}
                                        description={food.description}
                                        image={food.image}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
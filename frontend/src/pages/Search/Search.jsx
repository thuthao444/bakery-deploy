import React, { useContext, useState } from 'react';
import './Search.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import FoodItem from '../../components/FoodItem/FoodItem';

const Search = () => {
    const { url } = useContext(StoreContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [noFoodFound, setNoFoodFound] = useState(false);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${url}/api/food/search?search=${searchTerm}`);
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
            <div className="input-search">
                <input
                    type="text"
                    placeholder="Search for food"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type='submit' onClick={handleSearch}>Search</button>
            </div>
            
            <div className="search-results">
                {noFoodFound ? (
                    <div>No food</div>
                ) : (
                    searchResult.map((food) => (
                        <FoodItem
                            key={food._id}
                            id={food._id}
                            name={food.name}
                            price={food.price}
                            description={food.description}
                            image={food.image}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Search;

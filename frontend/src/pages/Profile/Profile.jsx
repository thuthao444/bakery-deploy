import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Profile = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState({});
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        sex: '',
        birthday: '',
        phone: '',
        address: ''
    });
    const [editEmail, setEditEmail] = useState(false);
    const [editName, setEditName] = useState(false);
    const [showUpdateProfile, setShowUpdateProfile] = useState(true);

    const getUserData = async (token) => {
        const response = await axios.get(url + `/api/user/get`, { headers: { token } });
        if (response.data.success) {
            setData(response.data.data);
            setFormData(response.data.data); // Update formData with fetched data
        } else {
            console.log("Error")
        }
    };

    useEffect(() => {
        getUserData(token);
    }, [token]);

    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            email: data.email,
            name: data.name
        }));
    }, [data, editEmail, editName]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/user/change`, formData, {
                headers: { token }
            });
            console.log(response.data);
            alert("Successful");
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleChangeEmail = () => {
        setEditEmail(prevState => !prevState);
    };

    const toggleChangeName = () => {
        setEditName(prevState => !prevState);
    };

    const handleShowUpdateProfile = () => {
        setShowUpdateProfile(true);
    };

    const handleShowMyProfile = () => {
        setShowUpdateProfile(false);
    };

    return (
        <div className="profile">
            <div className="container2">
                <h2>Manage your profile information</h2>
                <div className="sidebar">
                    <button id="button" className={showUpdateProfile ? "active" : ""} onClick={handleShowUpdateProfile}>Update</button>
                    <button id="button" className={!showUpdateProfile ? "active" : ""} onClick={handleShowMyProfile}>My Profile</button>
                </div>
                <div className="box">
                    {showUpdateProfile ? (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                {editEmail ? <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} /> : data.email} 
                                <button className='change' type="button" onClick={toggleChangeEmail}>Change</button>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                {editName ? <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} /> : data.name} 
                                <button className='change' type="button" onClick={toggleChangeName}>Change</button>
                            </div>
                            <div className="form-group">
                                <label htmlFor="sex">Sex:</label>
                                <select id="sex" name="sex" value={formData.sex} onChange={handleChange} required>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="Another">Another</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="birthday">Birthday:</label>
                                <input type="date" id="birthday" name="birthday" value={formData.birthday} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Phone</label>
                                <input type='text' id="address" name="phone" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address:</label>
                                <input type='text' id="address" name="address" value={formData.address} onChange={handleChange} required />
                            </div>
                            <button className='save' type="submit">Save</button>
                        </form>
                    ) : (
                        <div className='information'>
                            <div className='item'>
                                <label htmlFor="email">Email:</label>
                                <p>{data.email || 'None'}</p>
                            </div>
                            <div className='item'>
                                <label htmlFor="name">Name:</label>
                                <p>{data.name || 'None'}</p>
                            </div>
                            <div className='item'>
                                <label htmlFor="sex">Sex:</label>
                                <p>{data.sex || 'None'}</p>
                            </div>
                            <div className='item'>
                                <label htmlFor="birthday">Birthday:</label>
                                <p>{data.birthday || 'None'}</p>
                            </div>
                            <div className='item'>
                                <label htmlFor="phone">Phone:</label>
                                <p>{data.phone || 'None'}</p>
                            </div>
                            <div className='item'>
                                <label htmlFor="address">Address:</label>
                                <p>{data.address || 'None'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;

import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation()

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
                <h2>{t('Manage your profile information')}</h2>
                <div className="sidebar">
                    <button id="button" className={showUpdateProfile ? "active" : ""} onClick={handleShowUpdateProfile}>{t('Update')}</button>
                    <button id="button" className={!showUpdateProfile ? "active" : ""} onClick={handleShowMyProfile}>{t('My profile')}</button>
                </div>
                <div className="box">
                    {showUpdateProfile ? (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                {editEmail ? <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} /> : data.email} 
                                <button className='change' type="button" onClick={toggleChangeEmail}>{t('Change')}</button>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name">{t('Name')}:</label>
                                {editName ? <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} /> : data.name} 
                                <button className='change' type="button" onClick={toggleChangeName}>{t('Change')}</button>
                            </div>
                            <div className="form-group">
                                <label htmlFor="sex">{t('Sex')}:</label>
                                <select id="sex" name="sex" value={formData.sex} onChange={handleChange} required>
                                    <option value="male">{t('Male')}</option>
                                    <option value="female">{t('Female')}</option>
                                    <option value="Another">{t('Another')}</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="birthday">{t('Birthday')}:</label>
                                <input type="date" id="birthday" name="birthday" value={formData.birthday} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">{t('Phone')}:</label>
                                <input type='text' id="address" name="phone" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">{t('Address')}:</label>
                                <input type='text' id="address" name="address" value={formData.address} onChange={handleChange} required />
                            </div>
                            <button className='save' type="submit">{t('Save')}</button>
                        </form>
                    ) : (
                        <div className='information'>
                            <div className='item'>
                                <label htmlFor="email">Email:</label>
                                <p>{data.email || 'None'}</p>
                            </div>
                            <div className='item'>
                                <label htmlFor="name">{t('Name')}:</label>
                                <p>{data.name || 'None'}</p>
                            </div>
                            <div className='item'>
                                <label htmlFor="sex">{t('Sex')}:</label>
                                <p>{data.sex || 'None'}</p>
                            </div>
                            <div className='item'>
                                <label htmlFor="birthday">{t('Birthday')}:</label>
                                <p>{data.birthday || 'None'}</p>
                            </div>
                            <div className='item'>
                                <label htmlFor="phone">{t('Phone')}:</label>
                                <p>{data.phone || 'None'}</p>
                            </div>
                            <div className='item'>
                                <label htmlFor="address">{t('Address')}:</label>
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
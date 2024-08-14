import { selectedUserData } from '@/store/slices/authSlice';
import React from 'react'
import { useSelector } from 'react-redux';

const Profile = () => {
    const userData = useSelector(selectedUserData);

    return (
        <div>
            Profile id = {userData}
        </div>
    )
}

export default Profile;

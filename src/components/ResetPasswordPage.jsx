import React, { useState } from 'react';
import UsersService from '../components/services/UserServices';
import { useNavigate, Link } from 'react-router-dom';
// import './ResetPasswordPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../components/AuthProvider';

const ResetPasswordPage = ({ email, onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { user } = useAuth();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        setMessage('');
        setError('');

        try {
            console.log('Calling UsersService.changePassword');
            const response = await UsersService.changePassword({
                email: user.email,
                oldPassword,
                newPassword,
                confirmPassword
            });
            console.log('Response:', response);
            if (response.message) {
                setMessage(response.message);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                console.log(response.message);
            } else {
                setError(response.error || 'Something went wrong. Please try again.');
                console.log("response message in else block", response.error);
            }
        } catch (error) {
            console.error('Caught error:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center"
            style={{ padding: '40px' }} >
            <div className="reset-password-form">

                {message && (
                    <div className="alert alert-success" role="alert">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <form onSubmit={handleChangePassword}>
                    <div className="input-group mb-2">

                        <span className='input-group-text' id="addon-wrapping"> Old Password</span>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your old password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group mb-2">
                        <span className='input-group-text' id="addon-wrapping">New Password</span>
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            className="form-control"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="show-password-btn"
                        >
                            {/* {showNewPassword ? 'Hide' : 'Show'} */}
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className="input-group mb-2">
                        <span className='input-group-text' id="addon-wrapping">Confirm Password</span>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="form-control"
                            placeholder="Enter your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="show-password-btn"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>

                    </div>
                    <div className="d-flex justify-content-center mt-4">
                        <button type="submit" className="btn btn-primary">Change Password</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;

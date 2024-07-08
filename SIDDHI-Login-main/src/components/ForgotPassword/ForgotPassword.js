import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import { FaLock, FaAt } from 'react-icons/fa';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getAuthInstance } from '../../services/db';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const auth = getAuthInstance();
    const handleSubmit = async (e) => {
        e.preventDefault();    
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Check your email.");
        } catch (err) {
            alert(err.code);
        }
    };
    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit}>
                <h1>Reset Password</h1>
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Enter email of registered account"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button>Reset</button>
            </form>
        </div>
    );
}
export default ForgotPassword;
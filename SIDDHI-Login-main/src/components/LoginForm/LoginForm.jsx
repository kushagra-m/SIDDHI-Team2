
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './LoginForm.css';
// import { FaUser, FaLock } from 'react-icons/fa';
// import { FaAt } from "react-icons/fa";
// import { auth } from '../firebase/firebase';
// import axios from 'axios';

// const LoginForm = () => {
//   // const [email, setEmail] = useState('');
//   // const [password, setPassword] = useState('');
//   // const [error, setError] = useState(null);
//   // const navigate = useNavigate();

//   // const handleSubmit = async (event) => {
//   //   event.preventDefault();
//   //   try {
//   //     const res = await axios.post('http://localhost:5000/login', { email, password });
//   //     if (res.data.success) {
//   //       localStorage.setItem('token', res.data.token);
//   //       navigate('/dashboard');
//   //     }
//   //   } catch (err) {
//   //     setError(alert('Invalid credentials'));
//   //   }
//   // };

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e) => {
//       e.preventDefault();
//       try {
//           const userCredential = await auth.signInWithEmailAndPassword(email, password);
//           console.log('User logged in:', userCredential.user);
//           // Redirect or perform actions after successful login
//       } catch (error) {
//           console.error('Error signing in:', error.message);
//           // Handle error, e.g., display error message to user
//       }
//   };

//   return (
//     <div className="wrapper">
//       <form onSubmit={handleLogin}>
//         <h1>Login</h1>
//         <div className="input-box">
//           <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//           <FaAt className="icon" />
//         </div>
//         <div className="input-box">
//           <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//           <FaLock className="icon" />
//         </div>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <div className="remember-forgot">
//           <label>
//             <input type="checkbox" /> Remember me
//           </label>
//           <a href="#">Forgot password?</a>
//         </div>
//         <button type="submit">Login</button>
//         <div className="register-link">
//           <p>Don't have an account? <Link to="/signup">Register</Link></p>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default LoginForm;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { FaLock, FaAt } from 'react-icons/fa';
import { getAuthInstance, signInWithGooglePopup } from '../../services/db';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = getAuthInstance();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in:', userCredential.user);
            navigate('/dashboard'); // Redirect or perform actions after successful login
        } catch (error) {
            console.error('Error signing in:', error.message);
            setError('Invalid credentials'); // Set error message
            setError(alert("Invalid credentials"))
        }
    };

    const logGoogleUser = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithGooglePopup();
            console.log('User logged in:', userCredential.user);
            navigate('/dashboard'); // Redirect or perform actions after successful login
        } catch (error) {
            console.error('Error signing in:', error.message);
            setError('Invalid credentials'); // Set error message
        }
    }

    return (
        <div className="wrapper">
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FaAt className="icon" />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FaLock className="icon" />
                </div>
                {/* <div>
                    {error && <warning>{error}</warning>}
                </div> */}
                <div className="remember-forgot">
                    {/* <label>
                        <input type="checkbox" /> Remember me
                    </label> */}
                    <Link to="/forgotpassword"> Forgot Password? </Link>
                </div>
                <button type="submit" style={{ marginBottom: '10px' }}>Login</button>
                <button onClick={logGoogleUser}>Sign in with Google</button>
                <div className="register-link">
                    <p>Don't have an account? <Link to="/signup">Register</Link></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;

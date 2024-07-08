
// import React, { useState } from "react";
// import './SignupForm.css';
// import { FaUser, FaLock } from "react-icons/fa";
// import { FaAt } from "react-icons/fa";
// import axios from 'axios';

// const SignupForm = () => {
//   const [email, setEmail] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [password, setPassword] = useState('');
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [error, setError] = useState(null);

//   // const handleSubmit = async (event) => {
//   //   event.preventDefault();
//   //   try {
//   //     await axios.post('http://localhost:5000/signup', { email,firstName,lastName, password });
//   //     setIsRegistered(true);
//   //   } catch (err) {
//   //     setError(alert('User already exists or database error'));
//   //   }
//   // };

//   return (
//     <div className="wrapper">
//       <form onSubmit={handleSubmit}>
//         <h1>Signup</h1>
//         <div className="input-box">
//           <input type="text" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
//           <FaAt className="icon" />
//         </div>
//         <div className="input-box">
//           <input type="text" placeholder="FirstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
//           <FaUser className="icon" />
//         </div>
//         <div className="input-box">
//           <input type="text" placeholder="LastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
//           <FaUser className="icon" />
//         </div>
//         <div className="input-box">
//           <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
//           <FaLock className="icon" />
//         </div>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <button type="submit">Register</button>
//         {isRegistered && <p className="success-message">Registered successfully! Please proceed to the login page and login</p>}
//       </form>
//     </div>
//   );
// }

// export default SignupForm;


import React, { useState } from 'react';
import './SignupForm.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { FaAt } from 'react-icons/fa';
import { getAuthInstance } from '../../services/db'; // Adjust the path as necessary
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');
  const auth = getAuthInstance();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered:', userCredential.user);
      setIsRegistered(true);
      navigate("/")
    } catch (error) {
      console.error('Error registering user:', error.code, error.message);
      let errorMessage = 'Failed to register user. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email address is already in use by another account.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters long.';
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Signup</h1>
        <div className="input-box">
          <input type="text" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <FaAt className="icon" />
        </div>
        <div className="input-box">
          <input type="text" placeholder="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input type="text" placeholder="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <FaLock className="icon" />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Register</button>
        {/* {isRegistered && <p className="success-message">Registered successfully! Please proceed to the login page and login</p>} */}
      </form>
    </div>
  );
};

export default SignupForm;

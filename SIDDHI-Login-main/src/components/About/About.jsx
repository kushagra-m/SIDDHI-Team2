import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import './About.css';
import { getAuthInstance } from '../../services/db.mjs';
import { useState, useEffect } from 'react';

const About = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const auth = getAuthInstance();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
                alert("User not logged in!");
                navigate("/");
              }
        });
  
        return () => unsubscribe();
    }, [auth]);
    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }

    return (
        <div>
            <div className="wrapper-top">
            <div className="nselect">
                <ul>
                    <li><Link to="/history">History</Link></li>
                    <li><Link to="/dashboard">Working</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
                </ul>
            </div>
        </div>
        <div className='wrapperf'>
        <h1>About Us</h1>
        <p>Welcome to our Alzheimer's Detection Interface. This innovative tool has been developed by a dedicated team of students with the aim of providing a simple and effective way to screen for Alzheimer's disease using EEG recordings.</p>
        <br></br>
        <h2>Our Mission</h2>
        <p>Our mission is to leverage technology to aid in the early detection of Alzheimer's disease, making it accessible and convenient for healthcare providers and patients alike. By utilizing advanced machine learning algorithms, we strive to deliver accurate and reliable results.</p>
        <br></br>
        <h2>How It Works</h2>
        <p>The Alzheimer's Detection Interface is designed to be user-friendly and efficient. Here's how it works:</p>
        <ul>
            <li><span class="underline">Upload an EEG Recording</span>: Simply upload an EEG recording of the patient in '.set' format.</li>
            <li><span class="underline">Get Results</span>: Once the EEG recording is uploaded, our system analyzes the data and determines if the patient is positive or negative for Alzheimer's disease. Along with the result, we provide confidence scores to indicate the reliability of the detection.</li>
            <li><span class="underline">View History</span>: You can view the history of all uploaded recordings. This includes the name of the file, the result, and the timestamp of when the analysis was performed. This feature allows for easy tracking and record-keeping.</li>
        </ul>
        </div>
        </div>
    )
}

export default About;

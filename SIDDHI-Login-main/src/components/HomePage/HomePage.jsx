import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';
import Spinner from './Spinner';  
import RenderImage from './RenderImage';
import Disclaimer from '../Disclaimer/Disclaimer';
import { getAuthInstance, getDb } from '../../services/db';
import { collection, addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const HomePage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const auth = getAuthInstance();
    const db = getDb();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
                alert("User not logged in!");
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


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const customStringify = (obj) => {
        if (typeof obj === 'object' && obj !== null) {
            return Object.values(obj).join(', ');
        }
        return obj;
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }

        if(currentUser == null){
            alert("Please login first and then revisit")
            navigate("/");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        setLoading(true);
        setError(null);

        try {
            const res = await axios.post('http://104.211.117.234:8000/pred', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResponse(res.data);
            const email = currentUser.email;
            const filename = selectedFile.name;
            const result = customStringify(res.data.prediction).slice(0, 20);  // Assuming the response has a 'prediction' field
            const datetime = Timestamp.fromDate(new Date()).toDate();

            console.log('Filename:', filename);
            console.log('Result:', result);
            console.log('Datetime:', datetime);
            console.log('Email:', email);

            const addDataToFirestore = async (filename, result, datetime, email) => {
                try {
                    const db = getDb(); // Ensure getDb() returns a valid FirebaseFirestore instance
                    const docRef = await addDoc(collection(db, 'Results'), {
                        filename: filename, // Corrected field name
                        result: result,
                        datetime: datetime,
                        email: email // Corrected field name
                    });
                    console.log('Document written with ID: ', docRef.id);
                } catch (e) {
                    console.error('Error adding document: ', e);
                }
            };
            addDataToFirestore(filename, result, datetime, email);

            // // Save the file information to the database
            // const token = localStorage.getItem('token');
            // const filename = selectedFile.name;
            // const result = res.data.prediction;  // Assuming the response has a 'prediction' field
            // const date = new Date().toLocaleDateString();
            // const time = new Date().toLocaleTimeString();

            // await axios.post('http://localhost:5000/history', { filename, result, date, time }, {
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // });
        } 
        catch (err) {
            setError(err);
        } 
        finally {
            setLoading(false);
        }
    };
    

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

            <div className="wrapper">
                <h1>Upload File</h1>
                <input className="uploadf" type="file" onChange={handleFileChange} />
                <button className="upload" onClick={handleUpload} disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                </button>
                {loading && <div className="spinner-container">
                        <Spinner />
                    </div>}  {/* Show spinner while loading */}
                {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
                {response && (
                    <div>
                        <h2>Response</h2>
                        <h3>{customStringify(response.prediction)}</h3>
                        {response.image && <RenderImage imageData={response.image} />}
                    </div>
                )}
            </div>
            <Disclaimer />
        </div>
    );
}

export default HomePage;

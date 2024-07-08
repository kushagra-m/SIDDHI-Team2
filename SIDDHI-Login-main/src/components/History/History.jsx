import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './History.css';
import { findUserEntries } from '../../services/viewhis';
import { getAuthInstance } from '../../services/db.mjs';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const History = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const auth = getAuthInstance();
  const navigate = useNavigate();

  const handleLogout = () => {               
    signOut(auth).then(() => {
    // Sign-out successful.
        navigate("/");
        console.log("Signed out successfully")
    }).catch((error) => {
    // An error happened.
    });
}

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

  useEffect(() => {
      const fetchData = async () => {
          if (!currentUser) {
              setLoading(false);
              return;
          }

          try {
              const data = await findUserEntries(currentUser.email);
              setResults(data);
          } catch (error) {
              setError(error.message);
          }
          setLoading(false);
      };

      fetchData();
  }, [currentUser]);

  if (loading) {
      return <div>Loading...</div>;
  }

  if (error) {
      return <div>Error: {error}</div>;
  }

  const formatDate = (datetime) => {
    const dateObj = new Date(datetime.seconds * 1000); // Firestore Timestamp to JS Date
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (datetime) => {
    const dateObj = new Date(datetime.seconds * 1000); // Firestore Timestamp to JS Date
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
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
      <div className='wrapperh'>
        <table class="table-auto">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Result</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map(result => (
              <tr key={result.id}>
                <td>{result.filename}</td>
                <td>{result.result}</td>
                <td>{formatDate(result.datetime)}</td>
                <td>{formatTime(result.datetime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import PersonalDetails from './PersonalDetails';
import Attendance from './Attendance/Attendance';

import app from './firebaseConfig';
import { getDatabase, ref, get } from 'firebase/database';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';

import './Profile.css';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve email from location state or localStorage
  const email = location.state?.email ||   localStorage.getItem('userEmail');

  useEffect(() => {
    // Store email in localStorage if available in location.state
    if (location.state?.email) {
      localStorage.setItem('userEmail', location.state.email);
    }
  }, [location.state]);

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  

  const [datavals, setData] = useState([]);
  const [EMAILdata, setDatamail] = useState('');

  const fetchData = async () => {
    if (!email) {
      console.error('No email found');
      return;
    }
    
    setDatamail(email);
    const db = getDatabase(app);
    const dbRef = ref(db, `students/${email.substring(0, 11)}`);

    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const persondata = [];
        snapshot.forEach((childSnapshot) => {
          persondata.push({ id: childSnapshot.key, val: childSnapshot.val() });
          if( childSnapshot.key==="teacher" )
          {
            localStorage.setItem("tid",  childSnapshot.val() );
          }
        });
        setData(persondata);
      } else {
        console.warn('No data found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [email]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand">KARE SMART LOGIN</a>
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container-fluid full-page-container">
        <div className="row h-100">
          <div className="col-3 bg-light">
            <ul className="nav flex-column nav-pills" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" id="profile-tab" data-bs-toggle="tab" href="#profile" role="tab">
                  Profile
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="attendance-tab" data-bs-toggle="tab" href="#attendance" role="tab">
                  Attendance
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="marks-tab" data-bs-toggle="tab" href="#marks" role="tab">
                  Marks
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="lectures-tab" data-bs-toggle="tab" href="#lectures" role="tab">
                  Lectures
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="leave-tab" data-bs-toggle="tab" href="#leave" role="tab">
                  Leave Application
                </a>
              </li>
            </ul>
          </div>

          <div className="col-9">
            <div className="tab-content h-100 d-flex justify-content-center align-items-center">
              <div className="tab-pane fade show active" id="profile" role="tabpanel">
                <h3>Welcome, {email || 'Guest'}</h3>
                <PersonalDetails data={datavals} />
              </div>
              
              <div className="tab-pane fade" id="attendance" role="tabpanel">
                <h3>Attendance Content</h3>
                <Attendance data={EMAILdata} />
              </div>

              <div className="tab-pane fade" id="marks" role="tabpanel">
                <h3>Marks Content</h3>
                <p>This is the marks tab content.</p>
              </div>

              <div className="tab-pane fade" id="lectures" role="tabpanel">
                <h3>Lectures Content</h3>
                <p>This is the lectures tab content.</p>
              </div>

              <div className="tab-pane fade" id="leave" role="tabpanel">
                <h3>Leave Application Content</h3>
                <p>This is the leave application tab content.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

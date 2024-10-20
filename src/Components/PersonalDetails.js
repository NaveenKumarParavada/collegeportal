import React, { useState, useEffect } from 'react';
import './PersonalDetails.css';

import { useLocation, useNavigate } from 'react-router-dom';

import app from './firebaseConfig';
import { getDatabase, ref, get } from 'firebase/database';

const PersonalDetails = ({ data }) => {
  const [teacher, setTeacher] = useState(null);
  const location = useLocation();

  // Retrieve email from location state or localStorage
  const email = location.state?.email || localStorage.getItem('userEmail');
  const savedTeacherId = localStorage.getItem('teacherId'); // Retrieve teacherId from localStorage if available


  data = data || localStorage.getItem('data');

  console.log('Email:', email);

  const fetchData = async () => {
    if (!email) {
      console.error('No email found');
      return;
    }

    const db = getDatabase(app);
    console.log('Data:', data);

    // Use teacherId from localStorage if it's available, otherwise fetch from data
    let teacherId = savedTeacherId || data.find(item => item.id === 'teacher')?.val || localStorage.getItem("tid") ;

    if (!teacherId) {
      console.error('No teacher ID found');
      return;
    }

    // Save the teacherId to localStorage to persist across page reloads
    localStorage.setItem('teacherId', teacherId);

    const dbRef = ref(db, `teachers/${teacherId}`);

    console.log(`Fetching data from: teachers/${teacherId}/`);

    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const personData = [];
        snapshot.forEach(childSnapshot => {
          personData.push({ id: childSnapshot.key, val: childSnapshot.val() });
        });
        console.log('Fetched person data:', personData);

        const firstName = personData.find(item => item.id === 'first_name')?.val;
        setTeacher(firstName); // Update state with the first name
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
    <div className="personal-details-container">
      <div className="personal-details">
        <h3>Personal Details</h3>
        <table>
          <tbody>
            <tr>
              <td>Register Number</td>
              <td>{data.find(item => item.id === 'student_id')?.val || 'N/A'}</td>
            </tr>
            <tr>
              <td>Name of the Student</td>
              <td>{data.find(item => item.id === 'first_name')?.val || 'N/A'} {" "}
                  {data.find(item => item.id === 'last_name')?.val || 'N/A'}</td>
            </tr>
            <tr>
              <td>Degree / Programme</td>
              <td>BTECH</td>
            </tr>
            <tr>
              <td>Batch</td>
              <td>{data.find(item => item.id === 'year_in_engineering')?.val || 'N/A'}</td>
            </tr>
            <tr>
              <td>DATE OF BIRTH</td>
              <td>{data.find(item => item.id === 'date_of_birth')?.val || 'N/A'}</td>
            </tr>
            <tr>
              <td>Faculty Advisor</td>
              <td>{teacher || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PersonalDetails;

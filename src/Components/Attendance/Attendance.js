import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import app from '../firebaseConfig';
import { getDatabase, ref, get } from 'firebase/database';

const Attendance = () => {
    const location = useLocation();
    const email = location.state?.email || localStorage.getItem('userEmail');

    useEffect(() => {
        // Store email in localStorage if available in location.state
        if (location.state?.email) {
            localStorage.setItem('userEmail', location.state.email);
        }
    }, [location.state]);

    const [table1Data, setTable1Data] = useState([]);
    const [table2Data, setTable2Data] = useState([]);

    function convertTimeString(input) {

        if(input==="percentage")
        {
            return input;
        }
         // Split the input string based on ":"
    let [, hour, day, month, year] = input.split(":");

    // New time range (hardcoded)
    let newTimeRange = `${hour}:00 - ${parseInt(hour)+1}:00`;

    // Format the date part (day:month:year)
    let formattedDate = `${day}:${month}:${year.substring(0,4)}`;

    // Combine everything into the new format
    let output = `${formattedDate} (${newTimeRange}) `;
    
    return output;

      }
      
      
      

    const fetchData = async () => {
        const db = getDatabase(app);
        let userdata = [];
        
        if (!email) {
            alert('No email found');
            return;
        }
  
        const dbRef = ref(db, 'attendance/' + email.substring(0,11));
        try {
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    userdata.push(childSnapshot);
                });

                let i = 1;
                let j = 1;

                let dbmsper =0;
                let daaper =0;

                let dbms = [];
                let daa = [];

                userdata.forEach((element) => {
                    console.log(element.val());
                    if (element.key.includes("DBMS")) {
                        dbms.push({ id: i, time: element.key, attendance: element.val() });
                        if(element.val()==="P")
                        {
                            dbmsper++;
                        }
                        i++;
                    } else {
                        daa.push({ id: j, time: element.key, attendance: element.val() });
                        if(element.val()==="P")
                        {
                            daaper++;
                        }
                        j++;
                    }
                });


                if (i > 1) {
                    dbms.push({
                        id: "",
                        time: "percentage",
                        attendance: `${((dbmsper * 100) / (i - 1)).toFixed(0)}%`
                    });
                }

                if (j > 1) {
                    daa.push({
                        id: "",
                        time: "percentage",
                        attendance: `${((daaper * 100) / (j - 1)).toFixed(0)}%`
                    });
                }

                
                

                setTable1Data(dbms);
                setTable2Data(daa);
            } else {
                // alert('No data found');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // alert('Failed to fetch data');
        }
    };

    useEffect(() => {
        fetchData();
    }, [email]);


    return (
        <div>
            <h4>DBMS</h4>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Sno</th>
                        <th>Time</th>
                        <th>Attendance</th>
                    </tr>
                </thead>
                <tbody>
                    {table1Data.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{convertTimeString(item.time)}</td>
                            <td>{item.attendance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h4>DAA</h4>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Sno</th>
                        <th>Time</th>
                        <th>Attendance</th>
                    </tr>
                </thead>
                <tbody>
                    {table2Data.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{convertTimeString(item.time)}</td>
                            <td>{item.attendance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Attendance;

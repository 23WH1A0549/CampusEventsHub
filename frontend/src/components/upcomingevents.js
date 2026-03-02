import React, { useEffect, useState } from "react";
import API from "../api";

function UpcomingEvents(){

  const [events,setEvents] = useState([]);

  useEffect(()=>{
    const fetchData = async () => {
      try{
        const res = await API.get("/events/upcoming");
        setEvents(res.data);
      }
      catch(err){
        console.log(err);
      }
    };

    fetchData();
  },[]);

  return(
    <div>
      <h2>Upcoming Events</h2>

      {events.map(ev=>(
        <div key={ev._id}>
          <h3>{ev.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default UpcomingEvents;
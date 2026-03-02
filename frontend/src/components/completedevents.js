import React, { useEffect, useState } from "react";
import API from "../api";

function CompletedEvents(){

  const [events,setEvents] = useState([]);

  useEffect(()=>{
    fetchEvents();
  },[]);

  const fetchEvents = async()=>{
    try{
      const res = await API.get("/events/completed");
      setEvents(res.data);
    }
    catch(err){
      console.log(err);
    }
  };

  return(
    <div>
      <h2>Completed Events</h2>

      {events.map(ev=>(
        <div key={ev._id}>
          <h3>{ev.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default CompletedEvents;
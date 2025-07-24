import React from 'react';
// import "./css/CalendarLayout.css";
import {Outlet} from "react-router-dom";

const CalendarPageLayout = () => {

    return (
        <div className="calendarPage-container">
            <Outlet />
        </div>
    );
};

export default CalendarPageLayout;

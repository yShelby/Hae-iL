import React from 'react';
import {Outlet} from "react-router-dom";
import '../components/pages/css/MonthlyPage.css'

const MonthlyLayout = () => {

    return (
        <div className="monthly-container">
            <Outlet /> {/* MonthlyPage*/}
        </div>
    );
};

export default MonthlyLayout;

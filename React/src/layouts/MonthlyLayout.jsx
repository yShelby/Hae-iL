import React from 'react';
import {Outlet} from "react-router-dom";

const MonthlyLayout = () => {

    return (
        <div className="monthly-container">
            <Outlet />
        </div>
    );
};

export default MonthlyLayout;

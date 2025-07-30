import React from 'react';
import "./css/DashboardLayout.css";
import {Outlet} from "react-router-dom";

const DashboardLayout = () => {

    return (
        // dashoboardLayout은 이제 outlet 역할만 수행하도록 변경
        <div className="dashboard-container">
            <Outlet />
        </div>
    );
};

export default DashboardLayout;

import React from 'react';
import {Outlet} from "react-router-dom";

const SettingsLayout = () => {

    return (
        <div className="settings-container">
            <Outlet />
        </div>
    );
};

export default SettingsLayout;

import React from 'react';
import {Outlet} from "react-router-dom";

const SettingsLayout = () => {

    return (
        <div className="settings-container" style={{width:'100%'}}>
            <Outlet />
        </div>
    );
};

export default SettingsLayout;

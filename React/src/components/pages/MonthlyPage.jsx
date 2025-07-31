import {Route} from "react-router-dom";
import Calendar from "@features/calendar/Calendar.jsx";
import SelfDiagnosis from "@features/selfDiagnosis/SelflDiagnosis.jsx";
import React from "react";
import './css/MonthlyPage.css';

function MonthlyPage() {

    return (
        <div className="monthly-page">
            <Calendar />
            <SelfDiagnosis />
        </div>

    );
}

export default MonthlyPage;
import {Route} from "react-router-dom";
import Calendar from "@features/calendar/Calendar.jsx";
import SelfDiagnosis from "@features/selfDiagnosis/SelflDiagnosis.jsx";
import React from "react";

function MonthlyPage() {

    return (
        <div className="monthly-page" style={{display:"flex", justifyContent:"flex-start"}}>
            <Calendar />
            <SelfDiagnosis />
        </div>

    );
}

export default MonthlyPage;
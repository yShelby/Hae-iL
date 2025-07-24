import {Route} from "react-router-dom";
import Calendar from "@features/calendar/Calendar.jsx";
import SelfDiagnosis from "@features/selfDiagnosis/SelflDiagnosis.jsx";
import React from "react";

function MonthlyPage() {

    return (
        <div>
            <Calendar />
            <SelfDiagnosis />
        </div>
    );
}

export default MonthlyPage;
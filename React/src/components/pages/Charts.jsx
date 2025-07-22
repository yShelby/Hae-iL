import "./css/ChartsPage.css" // charts page css
import LineCharts from "@features/charts/LineChart.jsx";
import FloatingBarChart from "@features/charts/FloatingBarChart.jsx";
import NormalBarChart from "@features/charts/NormalBarChart.jsx";
import RadarChart from "@features/charts/RadarChart.jsx";
import {Button} from "@shared/UI/Button.jsx";
import {useState} from "react";
import {CategoryScale, Chart, LinearScale} from "chart.js";

Chart.register(LinearScale,CategoryScale);

export default function Charts(){

    // === 토글 버튼 ===
    // 1. 상태 확인 : "weekly"가 디폴트
    const [mode, setMode] = useState('weekly');
    // 2. 버튼 명과 토글 핸들러
    const isWeekly = mode === 'weekly';
    const toggleMode = () => setMode(isWeekly ? 'monthly' : 'weekly');

    // === 차트 디폴트 스타일 ===
    Chart.defaults.font.family = defaultChartStyle.fontFamily;
    Chart.defaults.font.weight = defaultChartStyle.fontWeight;

    return(
        <div className={"charts-page"}>
            <div className={"temporary"}>
                <div className={"weekly-monthly-chart"}>
                    <h3>주간/월간 감정 트래킹 차트</h3>
                    <div className={"w-m-button"}>
                        <Button onClick={toggleMode}>
                            {isWeekly ? "주간" : "월간"}
                        </Button>
                    </div>
                    {isWeekly ? (
                        <LineCharts
                            dates={dummyData.weeklyDates}
                            data={dummyData.weeklyScores}
                            chartTitle="주간 기분 변화"
                            chartStyle={weeklyLineStyle}
                            chartFontSize={chartFontSize.weeklyLineStyle}
                            gridColor = {gridColor}
                        />
                    ) : (
                        <LineCharts
                            dates={dummyData.monthlyDates}
                            data={dummyData.monthlyScores}
                            chartTitle="월간 기분 변화"
                            chartStyle={monthlyLineStyle}
                            chartFontSize={chartFontSize.monthlyLineStyle}
                            gridColor = {gridColor}
                        />
                    )}
                </div>
            <div className={"sleep-exercise-chart"}>
                <div className={"sleep-chart"}>
                    <h3>수면 차트</h3>
                    <FloatingBarChart dates = {dummyData.weeklyDates} data = {dummyData.sleepData} chartTitle = {"주간 수면 시간"} chartStyle = {sleepBarStyle} chartFontSize={chartFontSize.sleepBarStyle} gridColor = {gridColor} />
                </div>
                <div className={"exercise-chart"}>
                    <h3>운동 차트</h3>
                    <NormalBarChart dates = {dummyData.weeklyDates} data = {dummyData.exerciseData} chartTitle = {"주간 운동 시간"} chartStyle = {exerciseBarStyle} chartFontSize={chartFontSize.exerciseBarStyle} gridColor = {gridColor} />
                </div>
            </div>
            </div>
            <div className={"diagnosis-chart"}>
                <h3>자가진단 차트</h3>
                <RadarChart previousData = {dummyData.lastMonthData} data = {dummyData.thisMonthData} chartStyleThis = {diagnosisRadarStyle} chartStylePrevious = {previousDiagnosisRadarStyle} chartFontSize={chartFontSize.diagnosisRadarStyle} gridColor = {gridColor}/>
            </div>
        </div>
    )
}

//=============================================================
//=== 테마 분기에 따른 chart 스타일 ===
const defaultChartStyle = {
    fontFamily : 'SeoYoon',
    fontWeight : 'normal',
}

const gridColor = {
    color: 'rgba(0, 0, 0, 0.06)'
}

const weeklyLineStyle = {
    borderColor: 'rgba(75,192,192,1)',
    backgroundColor: 'rgba(75,192,192,0.1)',
    fill: 'start',
    tension: 0.4,
    pointRadius: 3,
}

const monthlyLineStyle = {
    borderColor: 'rgba(75,192,192,1)',
    backgroundColor: 'rgba(75,192,192,0.1)',
    fill: 'start',
    tension: 0.4,
    pointRadius: 3,
}

const sleepBarStyle = {
    backgroundColor: "rgba(54, 162, 235, 0.5)",
    borderColor: "rgba(54, 162, 235, 1)",
    borderWidth: 2,
    borderSkipped: false,
    borderRadius: 7,
}

const exerciseBarStyle = {
    backgroundColor: "rgba(255, 206, 86, 0.5)",
    borderColor: "rgba(255, 206, 86, 1)",
    borderWidth: 2,
    borderRadius: 10,
}

const diagnosisRadarStyle = {
    backgroundColor: 'rgba(255,99,132,0.15)',
    borderColor: 'rgba(255,99,132,1)',
    pointBackgroundColor: 'rgba(255,99,132,1)',
    pointBorderColor: 'rgba(255,99,132,1)',
    pointRadius: 2,
    borderWidth: 2,
}

const previousDiagnosisRadarStyle = {
    backgroundColor: 'rgba(54,162,235,0.2)',
    borderColor: 'rgba(54,162,235,1)',
    pointBackgroundColor: 'rgba(54,162,235,1)',
    pointBorderColor: 'rgba(54,162,235,1)',
    pointRadius: 2,
    borderWidth: 2,
    borderDash: [3, 3],
}

const chartFontSize = {
    weeklyLineStyle : 12,
    monthlyLineStyle : 9,
    sleepBarStyle : 12,
    exerciseBarStyle : 12,
    diagnosisRadarStyle : 16
}

//=============================================================
//=== 보조 함수 ===
// 날짜 (오늘부터 지난 일주일, 오늘부터 지난 30일)
const getPastDateLabels = (days) => {
    const labels = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }
    return labels;
}


// 변환 실행
const sleepDataInMinutes = (sleepData) => {
    return sleepData.map(({bedtime, waketime}) => {
        const [bh, bm] = bedtime.split(':').map(Number);
        const [wh, wm] = waketime.split(':').map(Number);
        const bMin = bh * 60 + bm;
        const wMin = wh * 60 + wm;
        return wMin <= bMin ? [bMin, wMin + 1440] : [bMin, wMin];
    });
};


//=============================================================
//=== 더미 데이터 생성 ===
// 랜덤 감정점수
const randomScore = Array.from({length: 30}, () => Math.floor(Math.random()*201)-100);
const randomExerciseDuration = (num) => { return Array.from({length: num}, () => Math.floor(Math.random()*201)); }

// 수면시간
const sleepData = [
    { bedtime: "01:00", waketime: "08:30" },
    { bedtime: "21:30", waketime: "07:50" },
    { bedtime: "01:15", waketime: "09:00" },
    { bedtime: "23:00", waketime: "08:00" },
    { bedtime: "01:45", waketime: "09:15" },
    { bedtime: "17:50", waketime: "23:30" },
    { bedtime: "01:20", waketime: "08:10" }
]

//=============================================================
// === 더미 데이터 리스트 ===
const dummyData = {
    // 주간/월간 date dummy
    weeklyDates: getPastDateLabels(7),
    monthlyDates: getPastDateLabels(30),

    // 주간/월간 감정점수 dummy
    monthlyScores: randomScore,
    weeklyScores: randomScore.slice(-7),

    // 주간 수면시간 dummy
    sleepData: sleepDataInMinutes(sleepData),

    // 주간 운동시간 dummy
    exerciseData : randomExerciseDuration(7),

    // 자가진단 dummy
    lastMonthData : [15, 12, 18],   // 예: 지난달 우울15/27, 불안12/21, 스트레스18/4
    thisMonthData : [9, 7, 26]     // 예: 이번달 우울9/27, 불안7/21, 스트레스26/40
}

import "./css/ChartsPage.css"; // charts page css
import LineCharts from "@features/charts/LineChart.jsx";
import FloatingBarChart from "@features/charts/FloatingBarChart.jsx";
import NormalBarChart from "@features/charts/NormalBarChart.jsx";
import RadarChart from "@features/charts/RadarChart.jsx";
import { Button } from "@shared/UI/Button.jsx";
import { useState } from "react";
import { CategoryScale, Chart, LinearScale } from "chart.js";
import DateNavigator from "@features/charts/DateNavigator.jsx";

Chart.register(LinearScale, CategoryScale);

export default function Charts() {
    // === 라벨용 날짜 받기 ===
    const [weeklyLabels, setWeeklyLabels] = useState([]); // 주간 라벨
    const [monthlyLabels, setMonthlyLabels] = useState([]); // 월간 라벨

    // === DB 조회용 날짜 받기 ===
    const [weeklyForFetch, setWeeklyForFetch] = useState([]); // 주간 DB 호출
    const [monthlyForFetch, setMonthlyForFetch] = useState([]); // 월간 DB 호출
    const [twoMonthsForFetch, setTwoMonthsForFetch] = useState([]); // 지난달, 이번달 DB 호출 (검사 전용)

    // === 토글 버튼 ===
    const [mode, setMode] = useState("weekly");
    const isWeekly = mode === "weekly";

    const toggleMode = () => setMode(isWeekly ? "monthly" : "weekly");

    // === 차트 기본 스타일 ===
    Chart.defaults.font.family = defaultChartStyle.fontFamily;
    Chart.defaults.font.weight = defaultChartStyle.fontWeight;

    // 감정 점수 데이터 (dummy) - 주간 / 월간 길이에 맞춰 slice 처리
    const moodDataForChart = isWeekly
        ? dummyData.weeklyScores
        : dummyData.monthlyScores;

    // 수면 및 운동 데이터도 날짜 배열 길이 맞추기
    const sleepDataForChart = dummyData.sleepData;
    const exerciseDataForChart = dummyData.exerciseData;

    // 자가진단 데이터
    const { lastMonthData, thisMonthData } = dummyData;

    return (
        <div className={"charts-page"}>
            <div className={"temporary"}>

                {/* 이전, 다음 날짜 호출하는 화살표 (< / >) */}
                <DateNavigator
                    isWeekly={mode}
                    onChangeWeekly={setWeeklyLabels}
                    onChangeMonthly={setMonthlyLabels}
                    onChangeWeeklyForFetch={setWeeklyForFetch}
                    onChangeMonthlyForFetch={setMonthlyForFetch}
                    onChangeTwoMonthsForFetch={setTwoMonthsForFetch}/>

                {/* 차트 부분 */}
                <div className={"weekly-monthly-chart"}>
                    <h3>주간/월간 감정 트래킹 차트</h3>
                    <div className={"w-m-button"}>
                        <Button onClick={toggleMode}>{isWeekly ? "주간" : "월간"}</Button>
                    </div>
                    {isWeekly ? (
                        <LineCharts
                            dates={weeklyLabels}
                            data={moodDataForChart}
                            chartTitle="주간 기분 변화"
                            chartStyle={weeklyLineStyle}
                            chartFontSize={chartFontSize.weeklyLineStyle}
                            gridColor={gridColor}
                        />
                    ) : (
                        <LineCharts
                            dates={monthlyLabels}
                            data={moodDataForChart}
                            chartTitle="월간 기분 변화"
                            chartStyle={monthlyLineStyle}
                            chartFontSize={chartFontSize.monthlyLineStyle}
                            gridColor={gridColor}
                        />
                    )}
                </div>

                <div className={"sleep-exercise-chart"}>
                    <div className={"sleep-chart"}>
                        <h3>수면 차트</h3>
                        <FloatingBarChart
                            dates={weeklyLabels}
                            data={sleepDataForChart}
                            chartTitle={isWeekly ? "주간 수면 시간" : "월간 수면 시간"}
                            chartStyle={sleepBarStyle}
                            chartFontSize={chartFontSize.sleepBarStyle}
                            gridColor={gridColor}
                        />
                    </div>
                    <div className={"exercise-chart"}>
                        <h3>운동 차트</h3>
                        <NormalBarChart
                            dates={weeklyLabels}
                            data={exerciseDataForChart}
                            chartTitle={isWeekly ? "주간 운동 시간" : "월간 운동 시간"}
                            chartStyle={exerciseBarStyle}
                            chartFontSize={chartFontSize.exerciseBarStyle}
                            gridColor={gridColor}
                        />
                    </div>
                </div>
            </div>
            <div className={"diagnosis-chart"}>
                <h3>자가진단 차트</h3>
                <RadarChart
                    previousData={lastMonthData}
                    data={thisMonthData}
                    chartStyleThis={diagnosisRadarStyle}
                    chartStylePrevious={previousDiagnosisRadarStyle}
                    chartFontSize={chartFontSize.diagnosisRadarStyle}
                    gridColor={gridColor}
                />
            </div>
        </div>
    );
}

//======= 스타일 설정 =======
const defaultChartStyle = {
    fontFamily: "SeoYoon",
    fontWeight: "normal"
};

const gridColor = {
    color: "rgba(0, 0, 0, 0.06)"
};

const weeklyLineStyle = {
    borderColor: "rgba(75,192,192,1)",
    backgroundColor: "rgba(75,192,192,0.1)",
    fill: "start",
    tension: 0.4,
    pointRadius: 3
};

const monthlyLineStyle = {
    borderColor: "rgba(75,192,192,1)",
    backgroundColor: "rgba(75,192,192,0.1)",
    fill: "start",
    tension: 0.4,
    pointRadius: 3
};

const sleepBarStyle = {
    backgroundColor: "rgba(54, 162, 235, 0.5)",
    borderColor: "rgba(54, 162, 235, 1)",
    borderWidth: 2,
    borderSkipped: false,
    borderRadius: 7
};

const exerciseBarStyle = {
    backgroundColor: "rgba(255, 206, 86, 0.5)",
    borderColor: "rgba(255, 206, 86, 1)",
    borderWidth: 2,
    borderRadius: 10
};

const diagnosisRadarStyle = {
    backgroundColor: "rgba(255,99,132,0.15)",
    borderColor: "rgba(255,99,132,1)",
    pointBackgroundColor: "rgba(255,99,132,1)",
    pointBorderColor: "rgba(255,99,132,1)",
    pointRadius: 2,
    borderWidth: 2
};

const previousDiagnosisRadarStyle = {
    backgroundColor: "rgba(54,162,235,0.2)",
    borderColor: "rgba(54,162,235,1)",
    pointBackgroundColor: "rgba(54,162,235,1)",
    pointBorderColor: "rgba(54,162,235,1)",
    pointRadius: 2,
    borderWidth: 2,
    borderDash: [3, 3]
};

const chartFontSize = {
    weeklyLineStyle: 12,
    monthlyLineStyle: 9,
    yearlyLineStyle: 12,
    sleepBarStyle: 12,
    exerciseBarStyle: 12,
    diagnosisRadarStyle: 16
};

//======= 보조 함수 =======
// 수면 시간 문자열을 분 단위 배열로 변환
const sleepDataInMinutes = (sleepData) => {
    return sleepData.map(({ bedtime, waketime }) => {
        const [bh, bm] = bedtime.split(":").map(Number);
        const [wh, wm] = waketime.split(":").map(Number);
        const bMin = bh * 60 + bm;
        const wMin = wh * 60 + wm;
        return wMin <= bMin ? [bMin, wMin + 1440] : [bMin, wMin];
    });
};

//======= 더미 데이터 =======

//랜덤 데이터
const random = Array.from({ length: 30 }, () => Math.floor(Math.random() * 201) - 100);


const dummyData = {
    monthlyScores: random,
    weeklyScores: random.slice(-7),
    sleepData: sleepDataInMinutes([
        { bedtime: "01:00", waketime: "08:30" },
        { bedtime: "21:30", waketime: "07:50" },
        { bedtime: "01:15", waketime: "09:00" },
        { bedtime: "23:00", waketime: "08:00" },
        { bedtime: "01:45", waketime: "09:15" },
        { bedtime: "17:50", waketime: "23:30" },
        { bedtime: "01:20", waketime: "08:10" }
    ]),
    exerciseData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 201)),
    lastMonthData: [15, 12, 18],
    thisMonthData: [9, 7, 26]
};

//=== API를 위한 리스트 ===
import {useAuth} from "@shared/context/AuthContext.jsx";
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import {fetchChartData} from '@/api/chartApi.js';

//=== 차트 생성을 위한 호출 리스트 ===
import "./css/ChartsPage.css"; // charts page css
import LineCharts from "@features/charts/LineChart.jsx";
import FloatingBarChart from "@features/charts/FloatingBarChart.jsx";
import NormalBarChart from "@features/charts/NormalBarChart.jsx";
import RadarChart from "@features/charts/RadarChart.jsx";
import DateNavigator from "@features/charts/DateNavigator.jsx";
import { Button } from "@shared/UI/Button.jsx";
import {useCallback, useEffect, useState} from "react";
import { format } from "date-fns";
import {
    extractDiagnosisResults,
    extractExerciseDuration, extractMoodScores,
    extractSleepTime
} from "@features/charts/util/chartDataListProcessor.js";

//=== Library Chart.js ===
import { CategoryScale, Chart, LinearScale } from "chart.js";
import {useTheme} from "@shared/styles/ThemeProvider.jsx";
Chart.register(LinearScale, CategoryScale);

// ===================================================
export default function Charts() {
    // === 로그인 ===
    const { user } = useAuth(); // 유저 확인
    const checkLogin = useCheckLogin(); // 로그인 확인

    // =========================================
    // === 날짜 및 모드 관리 ===
    const [endDate, setEndDate] = useState(new Date());
    const [mode, setMode] = useState("weekly");
    const isWeekly = mode === "weekly";

    const toggleMode = () => setMode(isWeekly ? "monthly" : "weekly");

    // === 라벨용 날짜 받기 ===
    const [weeklyLabels, setWeeklyLabels] = useState([]); // 주간 라벨
    const [monthlyLabels, setMonthlyLabels] = useState([]); // 월간 라벨

    // =========================================
    // === 호출 데이터 ===
    const [moodDataForChart, setMoodDataForChart] = useState([]);
    const [sleepDataForChart, setSleepDataForChart] = useState([]);
    const [exerciseDataForChart, setExerciseDataForChart] = useState([]);
    const [lastMonthData, setLastMonthData] = useState([]);
    const [thisMonthData, setThisMonthData] = useState([]);

    // === 백엔드에서 데이터 가져오기 ===
    const fetchData = useCallback(async () => {
        if (!checkLogin()) return;

        try {
            const response = await fetchChartData({
                mode: mode,
                endDate: format(endDate, "yyyy-MM-dd"),
            });

            // 데이터 설정
            setMoodDataForChart(extractMoodScores(response.data?.moodScores));
            setSleepDataForChart(extractSleepTime(response.data?.sleepTime));
            setExerciseDataForChart(extractExerciseDuration(response.data?.exerciseDuration));
            setLastMonthData(extractDiagnosisResults(response.data?.lastMonthResults));
            setThisMonthData(extractDiagnosisResults(response.data?.thisMonthResults));

        } catch (e) {
            console.error("차트 데이터 로딩 실패:", e);
        }
    }, [mode, endDate]);

    useEffect(() => { // mode나 endDate가 바뀔 때마다 fetchData 함수 재실행
        fetchData().catch(console.error);
    }, [fetchData]);

    // === 더미 데이터 (실제 데이터 로딩 전까지 사용) ===
    // 감정 점수 데이터 (dummy) - 주간 / 월간 길이에 맞춰 slice 처리
    const displayMoodData = moodDataForChart.length > 0
        ? moodDataForChart
        : (isWeekly ? dummyData.weeklyScores : dummyData.monthlyScores);

    // 수면 및 운동 데이터도 날짜 배열 길이 맞추기
    const displaySleepData = sleepDataForChart.length > 0
        ? sleepDataForChart
        : dummyData.sleepData;

    const displayExerciseData = exerciseDataForChart.length > 0
        ? exerciseDataForChart
        : dummyData.exerciseData;

    // 자가진단 데이터
    const displayLastMonthData = lastMonthData.length > 0
        ? lastMonthData
        : dummyData.lastMonthData;

    const displayThisMonthData = thisMonthData.length > 0
        ? thisMonthData
        : dummyData.thisMonthData;

    // =========================================
    // === 차트 기본 스타일 ===
    Chart.defaults.font.family = defaultChartStyle.fontFamily;
    Chart.defaults.font.weight = defaultChartStyle.fontWeight;

    // === 테마 키 ===
    const { themeKey } = useTheme();

    return (
        <div className={"charts-page"}>
            <div className={"upper-chart-box"}>
                {/* 차트 부분 */}
                <div className={"upper-chart"}>
                    <div className={"title-button"}>
                    <h3>주간/월간 감정</h3>
                        <div className={"button-only"}>
                            {/* 이전, 다음 날짜 호출하는 화살표 (< / >) */}
                            <DateNavigator
                                endDate={endDate}
                                setEndDate={setEndDate}
                                mode={mode}
                                onChangeWeekly={setWeeklyLabels}
                                onChangeMonthly={setMonthlyLabels}
                            />
                            <Button onClick={toggleMode}>{isWeekly ? "주간" : "월간"}</Button>
                        </div>
                    </div>
                    <div className={"mood-score-line-chart"}>
                        {isWeekly ? (
                            <LineCharts
                                key={mode + JSON.stringify(moodDataForChart)}  // mode 바뀌거나 데이터 바뀌면 새 컴포넌트 마운트
                                dates={weeklyLabels}
                                rawData={moodDataForChart}
                                // rawData={dummyData.weeklyScores} //더미데이터
                                chartTitle="주간 기분 변화"
                                chartStyle={moodLineStyle[themeKey]}
                                chartFontSize={chartFontSize.weeklyLineStyle}
                                gridColor={gridColor}
                            />
                        ) : (
                            <LineCharts
                                key={mode + JSON.stringify(moodDataForChart)}  // mode 바뀌거나 데이터 바뀌면 새 컴포넌트 마운트
                                dates={monthlyLabels}
                                rawData={moodDataForChart}
                                // rawData={dummyData.monthlyScores} //더미데이터
                                chartTitle="월간 기분 변화"
                                chartStyle={moodLineStyle[themeKey]}
                                chartFontSize={chartFontSize.monthlyLineStyle}
                                gridColor={gridColor}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className={"lower-chart-box"}>
                <div className={"lower-chart"}>
                    <div className={"sleep-exercise-chart-box"}>
                        <div className={"sleep-chart"}>
                            <h4>주간 수면 시간</h4>
                            <FloatingBarChart
                                dates={weeklyLabels}
                                rawData={sleepDataForChart}
                                // rawData={dummyData.sleepData} //더미데이터
                                chartTitle={"주간 수면 시간"}
                                chartStyle={sleepBarStyle[themeKey]}
                                chartFontSize={chartFontSize.sleepBarStyle}
                                gridColor={gridColor}
                            />
                        </div>

                        <div className={"exercise-chart"}>
                            <h4>주간 운동 시간</h4>
                            <NormalBarChart
                                dates={weeklyLabels}
                                rawData={exerciseDataForChart}
                                // rawData={dummyData.exerciseData} //더미데이터
                                chartTitle={"주간 운동 시간"}
                                chartStyle={exerciseBarStyle[themeKey]}
                                chartFontSize={chartFontSize.exerciseBarStyle}
                                gridColor={gridColor}
                            />
                        </div>
                    </div>
                    <div className={"diagnosis-chart-box"}>
                        <div className={"diagnosis-chart"}>
                            <h3>자가진단 결과</h3>
                            <RadarChart
                                previousData={lastMonthData}
                                rawData={thisMonthData}
                                // previousData={dummyData.lastMonthData} //더미데이터
                                // rawData={dummyData.thisMonthData} //더미데이터
                                chartStyleThis={diagnosisRadarStyle[themeKey]}
                                chartStylePrevious={previousDiagnosisRadarStyle[themeKey]}
                                chartFontSize={chartFontSize.diagnosisRadarStyle}
                                gridColor={gridColor}
                            />
                        </div>
                    </div>
                </div>
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

const moodLineStyle = {
    theme1 : {
        borderColor: "rgba(108,92,231,0.5)",
        backgroundColor: "rgba(108,92,231,0.1)",
        fill: "start",
        tension: 0.4,
        pointRadius: 3
    },
    theme2 : {
        borderColor: "rgba(74,144,226,0.5)",
        backgroundColor: "rgba(74,144,226,0.1)",
        fill: "start",
        tension: 0.4,
        pointRadius: 3
    },
    theme3 : {
        borderColor: "rgb(38,208,206,0.5)",
        backgroundColor: "rgba(38,208,206,0.3)",
        fill: "start",
        tension: 0.4,
        pointRadius: 3
    },
};

const sleepBarStyle = {
    theme1:{
        borderColor: "rgba(116,185,255,0.7)",
        backgroundColor: "rgba(116,185,255,0.5)",
        borderWidth: 3,
        borderSkipped: false,
        borderRadius: 7
    },
    theme2:{
        borderColor: "rgba(126,214,223,0.7)",
        backgroundColor: "rgba(126,214,223, 0.5)",
        borderWidth: 3,
        borderSkipped: false,
        borderRadius: 7
    },
    theme3:{
        borderColor: "rgba(50,204,117,0.7)",
        backgroundColor: "rgba(50,204,117,0.5)",
        borderWidth: 3,
        borderSkipped: false,
        borderRadius: 7
    }

};

const exerciseBarStyle = {
    theme1:{
        borderColor: "rgba(255,172,205,0.7)",
        backgroundColor: "rgba(255,172,205, 0.5)",
        borderWidth: 3,
        borderRadius: 10
    },
    theme2:{
        borderColor: "rgba(165,168,239,0.7)",
        backgroundColor: "rgba(165,168,239,0.5)",
        borderWidth: 3,
        borderRadius: 10
    },
    theme3:{
        borderColor: "rgba(255,206,86,0.7)",
        backgroundColor: "rgba(255,206,86,0.5)",
        borderWidth: 3,
        borderRadius: 10
    }
};

const diagnosisRadarStyle = {
    theme1:{
        borderColor: "rgba(253,121,168,0.9)",
        backgroundColor: "rgba(253,121,168,0.15)",
        pointBackgroundColor: "rgba(253,121,168,1)",
        pointBorderColor: "rgba(253,121,168,1)",
        pointRadius: 2,
        borderWidth: 2
    },
    theme2:{
        borderColor: "rgba(148,112,234,0.9)",
        backgroundColor: "rgba(148,112,234,0.15)",
        pointBackgroundColor: "rgba(148,112,234,1)",
        pointBorderColor: "rgba(148,112,234,1)",
        pointRadius: 2,
        borderWidth: 2
    },
    theme3:{
        borderColor: "rgba(255,162,100,0.9)",
        backgroundColor: "rgba(255,162,100,0.15)",
        pointBackgroundColor: "rgba(255,162,100,1)",
        pointBorderColor: "rgba(255,162,100,1)",
        pointRadius: 2,
        borderWidth: 2
    }
};

const previousDiagnosisRadarStyle = {
    theme1:{
        borderColor: "rgba(127,168,228,0.9)",
        backgroundColor: "rgba(127,168,228,0.2)",
        pointBackgroundColor: "rgba(127,168,228,1)",
        pointBorderColor: "rgba(127,168,228,1)",
        pointRadius: 2,
        borderWidth: 2,
        borderDash: [3, 3]
    },
    theme2:{
        borderColor: "rgba(108,172,175,0.9)",
        backgroundColor: "rgba(108,172,175,0.2)",
        pointBackgroundColor: "rgba(108,172,175,1)",
        pointBorderColor: "rgba(108,172,175,1)",
        pointRadius: 2,
        borderWidth: 2,
        borderDash: [3, 3]
    },
    theme3:{
        borderColor: "rgba(135,197,179,0.9)",
        backgroundColor: "rgba(135,197,179,0.2)",
        pointBackgroundColor: "rgba(135,197,179,1)",
        pointBorderColor: "rgba(135,197,179,1)",
        pointRadius: 2,
        borderWidth: 2,
        borderDash: [3, 3]
    }
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

function timeStringToMinutes(timeStr) {
    const [hourStr, minuteStr] = timeStr.split(':');
    const hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);
    return hours * 60 + minutes;
}

// sleepDataInMinutes 함수: bedtime, waketime 문자열 배열을 분 단위 배열로 변환
function sleepDataInMinutes(rawArray) {
    return rawArray.map(({ bedtime, waketime }) => [
        timeStringToMinutes(bedtime),
        timeStringToMinutes(waketime)
    ]);
}

//======= 더미 데이터 =======

// 랜덤 데이터
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
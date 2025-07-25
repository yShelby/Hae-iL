import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

export default function SleepFloatingBarChart({dates, rawData, chartTitle, chartStyle, chartFontSize, gridColor}) {

    // === raw data 처리 ===
    // data가 NaN 값으로 들어오는 것 방지
    const data = Array.isArray(rawData)
        ? rawData.map(value => Number.isNaN(value) ? null : value)
        : [];

    // ===============================================

    // === 시간 계산 로직 ===

    // 기본 로직
        // 1. 취침 시간은 일반적으로 전날과 다음날(=일기 작성 당일)에 걸쳐있음(주로 이틀, 최대 사흘까지)
        // 2. 취침시각과 일어난 시각이 전날에서 다음날에 걸쳐져 있는지, 다음날 당일에만 있는지 확인하기 위한 로직
            // 2-1. 취침시각 - 일어난 시각 > 0 : 취침시각은 전날, 일어난 시각은 다음날
            // 2-2. 취침시각 - 일어난 시각 =< 0 : 취침시각은 다음날, 일어난 시각도 다음날
        // 3. 취침시각이 오전(AM)인지 오후(PM)인지 판별하기 위해 SLEEP_DAY/2 사용
            // 3-1. 취침시각 - SLEEP_DAY/2 >= 0 : 취침시각은 오후
            // 3-2. 취침시각 - SLEEP_DAY/2 < 0 : 취침시각은 오전

    // [bedtime, waketime] 로직
        // 1. 취침시각 - SLEEP_DAY/2 >= 0 이며 취침시각 - 일어난 시각 > 0인 경우 (취침시각 전날 오후, 일어난 시각 다음날 오전)
            // = [bedtime, waketime + SLEEP_DAY]
        // 2. 취침시각 - SLEEP_DAY/2 >= 0 이며 취침시각 - 일어난 시각 =< 0인 경우 (취침시각 전날 오후, 일어난 시각 전날 오후)
            // = [bedtime, waketime]
        // 3. 취침시각 - SLEEP_DAY/2 < 0이며, 취침시각 - 일어난 시각 > 0인 경우 (취침시각 다음날 오전, 일어난 시각 다다음날 오전)
            // = [bedtime + SLEEP_DAY, waketime  + SLEEP_DAY * 2]
        // 4. 취침시각 - SLEEP_DAY/2 < 0, 취침시각 - 일어난 시각 =< 0인 경우 (취침시각 다음날 오전, 일어난 시각 다음날 오전 또는 오후)
            // = [bedtime + SLEEP_DAY, waketime  + SLEEP_DAY]

    // ===============================================

    // === 수면 시간 처리 ===

    const SLEEP_DAY = 1440; // 24시간

    // [bedtime, waketime] -> [normBed, normWake] 변환
    function normalizeSleepTime(bed, wake) {

        // [bedtime, waketime] return 하기

        if (bed >= SLEEP_DAY/2 && wake < bed) {
            // 취침시각 전날 오후, 일어난 시각 다음날 오전 (ex. 21:00~08:00)
            wake += SLEEP_DAY;
        } else if (bed < SLEEP_DAY/2 && wake < bed) {
            // 취침시각 다음날 오전, 일어난 시각 다다음날 오전 (ex. 03:00~01:15)
            bed += SLEEP_DAY;
            wake += SLEEP_DAY * 2;
        } else if (bed <= SLEEP_DAY/2 && wake >= bed) {
        // 취침시각 다음날 오전, 일어난 시각 다음날 오전 또는 오후 (ex. 00:30~08:30)
        bed += SLEEP_DAY;
        wake += SLEEP_DAY;
        }
        // 취침시각 전날 오후, 일어난 시각 전날 오후 (ex. 21:00~23:30)는 변화 없으므로 그냥 return

        return [bed, wake];

    }

    // data: [[normBed, normWake], ...]
    const normalizedData = data.map(arr => normalizeSleepTime(arr[0], arr[1]));

    // y축 범위 자동계산 (pad 3시간 : minTime - 3h ~ maxTime + 3h)
    const starts = normalizedData.map(([bed]) => bed);
    const ends   = normalizedData.map(([_, wake]) => wake);
    const padding = 180;
    const yMin = starts.length > 0 ? Math.max(0, Math.min(...starts) - padding) : 0;
    const yMax = ends.length > 0 ? Math.min(SLEEP_DAY * 3, Math.max(...ends) + padding) : 0;

    // =======================================================
    // === for chart ===
    const chartData = {
        labels : dates,
        datasets: [
            {
                label: chartTitle,
                data: normalizedData,
                ...chartStyle
            },
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label(ctx) {
                        const value = ctx.raw;
                        if (Array.isArray(value)) {
                            return `수면: ${formatHM(value[0])} ~ ${formatHM(value[1])}`;
                        }
                        return '';
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    font:{
                        size:chartFontSize
                    }
                },
                grid: {
                    display: false
                }
            },
            y: {
                min: yMin,
                max: yMax,
                beginAtZero: false,
                ticks: {
                    stepSize: 60, // 60분
                    maxTicksLimit: 24, // 하루 24시간
                    callback: (value) => formatHM(value),
                },
                grid: {
                    ...gridColor,
                },
            },
        },
    };

    // 시각 라벨 포맷: 0~48h 사이여도 항상 00:00~23:59 (실제 시간)로 표기
    function formatHM(value) {
        const h = Math.floor((value % SLEEP_DAY) / 60);
        const m = value % 60;
        return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;
    }

    return <Bar data={chartData} options={options} />;
}

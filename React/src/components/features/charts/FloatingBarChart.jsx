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

    const SLEEP_DAY = 1440; // 24시간

    // 백엔드에서 이미 정규화된 데이터가 옴: [[normBed, normWake], ...]
    const normalizedData = data;

    // y축 범위 자동계산 (pad 3시간 : minTime - 3h ~ maxTime + 3h)
    const starts = normalizedData.map(([bed]) => bed);
    const ends   = normalizedData.map(([_, wake]) => wake);
    const padding = 180;

    const filteredStarts = starts.filter(v => v !== null); // null 제외
    const filteredEnds = ends.filter(v => v !== null); // null 제외

    const yMin = filteredStarts.length > 0 ? Math.max(0, Math.min(...filteredStarts) - padding) : 720;
    const yMax = filteredEnds.length > 0 ? Math.min(SLEEP_DAY * 3, Math.max(...filteredEnds) + padding) : SLEEP_DAY + 720;

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
        maintainAspectRatio: false,
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
                    precision: 0,
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
        const m = Math.floor(value % 60);
        return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;
    }

    return (
        <div style={{height: "95%", margin: "0 auto"}}>
            <Bar data={chartData} options={options} />
        </div>
    );
}

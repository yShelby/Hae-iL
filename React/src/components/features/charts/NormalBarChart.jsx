import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from 'chart.js';

// 차트 요소 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

export default function NormalBarChart({ dates, rawData, chartTitle, chartStyle, chartFontSize, gridColor }) {

    // === raw data 처리 ===
    // data가 NaN 값으로 들어오는 것 방지
    const data = Array.isArray(rawData)
        ? rawData.map(value => Number.isNaN(value) ? null : value)
        : [];

    // 최대값 계산, null과 undefined 제외
    const validData = data.filter(v => typeof v === "number" && true);
    const maxDuration = validData.length > 0 ? Math.max(...validData) : 0;

    // y축 최대값 설정 : 30분 단위로 yMax 설정 (ex. 40 -> yMax : 60, 70 -> yMax : 90 // 단, 30 -> yMax : 60으로 표기), 기본값 120
    const step = 30;
    const valMax = Math.max(...validData);
    const padding = Math.ceil(valMax/step) * step;
    const yMax = maxDuration > 0 ? (valMax/step) !== 0 ? padding : padding + step : 120;

    const chartData = {
        labels: dates,
        datasets: [
            {
                label: chartTitle,
                data: data, // [숫자, 숫자, ...]
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
                        return `운동: ${formatMinutes(value)}`;
                    }
                }
            }
        },
        scales: {
            x : {
                ticks: {
                    font:{
                        size:chartFontSize
                    }
                },
                grid: {
                    ...gridColor,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 30,
                    callback: val => formatMinutes(val),
                },
                grid: {
                    display: false
                },
                max: yMax
            }
        }
    };
    return (
        <div style={{height: "95%", margin: "0 auto"}}>
            <Bar data={chartData} options={options} />
        </div>
    );
}

function formatMinutes(min) {
    if (min == null || isNaN(min)) return '';

    // 0.5시간 단위 (30분)을 기준으로 반올림
    const halfHours = Math.round(min / 30) * 0.5;

    // 소수점이 0이면 정수로 표시, 아니면 한자리 소수점만 표시
    if (Number.isInteger(halfHours)) {
        return `${halfHours}h`;
    } else {
        return `${halfHours.toFixed(1)}h`;
    }
}

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
                }
            }
        }
    };
    return <Bar data={chartData} options={options} />;
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

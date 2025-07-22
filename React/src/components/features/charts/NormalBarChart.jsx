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

export default function NormalBarChart({ dates, data, chartTitle, chartStyle, chartFontSize, gridColor }) {
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
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h ${m}m`;
}
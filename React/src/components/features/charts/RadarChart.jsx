import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);


export default function RadarChart({previousData, rawData, chartStyleThis, chartStylePrevious, chartFontSize, gridColor}) {

    // === raw data 처리 ===
    // data가 NaN 값으로 들어오는 것 방지
    const data = Array.isArray(rawData)
        ? rawData.map(value => Number.isNaN(value) ? null : value)
        : [];

    // === 1. 공통 라벨/총점 ===
    const LABELS = ['불안', '우울', '스트레스'];
    const MAX_SCORES = [27, 21, 40];

    // === 2. 100점 환산 함수 ===
    function normalize(raw, max) {
        return raw.map((v, i) => (v / max[i]) * 100);
    }
    const lastMonthNormalized = normalize(previousData, MAX_SCORES);
    const thisMonthNormalized = normalize(data, MAX_SCORES);

    // === 3. for chart ===
    const chartData = {
        labels: LABELS,
        datasets: [
            {
                label : "이번 달",
                data: thisMonthNormalized,
                ...chartStyleThis
            },
            {
                label : "지난 달",
                data: lastMonthNormalized,
                ...chartStylePrevious
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                reverse: true,
                labels: {
                    usePointStyle: true,       // 포인트 스타일 사용
                    pointStyle: 'line',        // 'circle', 'rect', 'line', 'triangle' 등 가능
                    pointStyleWidth: 20,
                },
            },
            tooltip: {
                callbacks: {
                    // 툴팁에 "실제점수/총점(%)" 함께 표시
                    label: function(context) {
                        const i = context.dataIndex;
                        const datasetIndex = context.datasetIndex;
                        const rawScore = datasetIndex === 0 ? data[i] : previousData[i];
                        const maxScore = MAX_SCORES[i];
                        const percent = context.formattedValue;
                        return `${context.dataset.label}: ${Math.round(percent)}점`;
                    }
                }
            }
        },
        scales: {
            r: {
                min: 0,
                max: 100,
                grid: {
                    circular: true,  // 모양 원형으로
                },
                ticks: {
                    stepSize: 20,
                    backdropColor: 'transparent',
                    callback: (v) => `${v}`,
                },
                pointLabels: {
                    font: { size: chartFontSize }
                }
            }
        }
    };

    return (
        <div style={{height: "95%", margin: "0 auto"}}>
            <Radar data={chartData} options={options}/>
        </div>
    );
}

import { useMemo } from 'react';

import 'chart.js/auto';
import { Line } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// 차트 요소 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend
);


export default function LineChart({ dates, rawData, chartTitle, chartStyle, chartFontSize, gridColor }){

    // === raw data 처리 ===
    // data가 NaN 값으로 들어오는 것 방지
    const data = Array.isArray(rawData)
        ? rawData.map(value => Number.isNaN(value) ? null : value)
        : [];

    console.log("rawdata:" + rawData);
    console.log("dates:" + dates);
    console.log("chartTitle:" + chartTitle);

    // === Animation ===
    // 전체 애니메이션 시간(ms)
    const totalDuration = 300;
    const delayBetweenPoints = totalDuration / data.length;

    // 이전 Y값 계산 함수
    const previousY = (ctx) =>
        ctx.index === 0
            ? ctx.chart.scales.y.getPixelForValue(data[0])
            : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

    const animation = useMemo(() => ({
        x: {
            type: 'number',
            easing: "easeInOutQuart",
            duration: delayBetweenPoints,
            from: NaN,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        },
        y: {
            type: 'number',
            easing: "easeInOutQuart",
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        }
    }), [delayBetweenPoints, data]);

    //==========================================
    //=== for chart ===

    const chartData = useMemo(() => ({
        labels : dates,
        datasets: [{
            label: chartTitle,
            data,
            ...chartStyle,
            clip: false, // 96점 이상일 때 선, 포인트 잘림 방지
        }]
    }), [dates, data, chartTitle]);

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        spanGaps: true,
        animation,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `감정점수 : ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks:{
                    autoSkip: false,
                    font:{
                        size: chartFontSize
                    },
                },
                grid:{
                    ...gridColor,
                },
            },
            y: {
                min: -100,
                max: 100,
                grid: {
                    display: false,

                },
            },
        },
    }), [chartTitle]);



    return <Line data={chartData} options={options} plugins={[zeroLinePlugin]} redraw />;
};

// ======== 0선 점선 플러그인 ========
const zeroLinePlugin = {
    id: 'zeroLine',
    beforeDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        const yZero = y.getPixelForValue(0);

        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([2, 4]); // 점선 패턴
        ctx.strokeStyle = 'rgba(191,191,191,0.9)'; // 선 색상
        ctx.lineWidth = 0.5;
        ctx.moveTo(x.left, yZero);
        ctx.lineTo(x.right, yZero);
        ctx.stroke();
        ctx.restore();
    }
};

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


export default function LineChart({ dates, data, chartTitle, chartStyle }){

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
            ...chartStyle
        }]
    }), [dates, data, chartTitle]);

    const options = useMemo(() => ({
        responsive: true,
        animation,
        plugins: {
            legend: { display: false },
            title: { display: true, text: chartTitle },
        },
        scales: {
            x: {
                ticks:{
                    autoSkip: false
                }
            },
            y: { min: -100, max: 100 },
        },
    }), [chartTitle]);



    return <Line data={chartData} options={options} />;
};



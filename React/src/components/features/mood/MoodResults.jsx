import React, {useEffect, useMemo, useState} from 'react';
import './css/MoodResult.css'
import MoodTags from "@features/mood/MoodTags.jsx";
import {
    Chart as ChartJS,
    ArcElement,
    LinearScale
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement,LinearScale);

export default function MoodResult({ result }) {
    const { details, mood_score, tags } = result;
    const [selectedMood, setSelectedMood] = useState({});

    // 초기 렌더링 시 가장 큰 값 호출
    useEffect(() => {
        if (details && details.length > 0) {
            const maxItem = details.reduce((a, b) => (b.percentage > a.percentage ? b : a));
            setSelectedMood({
                label : maxItem.mood_type,
                moodType: getNameAndColorForMood(maxItem.mood_type).moodType,
                percentage: maxItem.percentage
            });
        }
    }, [details]);

    // Chart data
    const chartData = useMemo(() => ({
        labels: details.map(detail => getNameAndColorForMood(detail.mood_type).moodType),
        datasets: [{
            data: details.map(detail => detail.percentage),
            backgroundColor: details.map(detail => getNameAndColorForMood(detail.mood_type).color),
            borderWidth: chartStyle.chartBorderWidth,
            // borderColor: chartStyle.chartBorderColor,
            hoverOffset: chartStyle.chartHoverOffset,
            hoverBorderWidth: chartStyle.chartHoverBorderWidth,
            hoverBorderColor: details.map(detail => getNameAndColorForMood(detail.mood_type).hoverBorderColor)
        }]
    }), [details]);

    // Chart 옵션
    const chartOptions = useMemo(() => ({
        // 애니메이션 효과
        animation: {
            duration: chartStyle.animateDuration,
            easing: chartStyle.animateEasing,
            animateRotate: chartStyle.animateRotate,
        },
        responsive: chartStyle.canvasResponsive,
        maintainAspectRatio: chartStyle.canvasMaintainAspectRatio,
        layout: {
            padding: {
                top: chartStyle.canvasPadding,
                bottom: chartStyle.canvasPadding,
                left: chartStyle.canvasPadding,
                right: chartStyle.canvasPadding,
            }
        },
        plugins : {
            centerPercentage : {
                label : selectedMood.label,
                percentage : selectedMood.percentage
            },
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const clickedIndex = elements[0].index;
                setSelectedMood({
                    label : details[clickedIndex].mood_type, // 기쁨/행복
                    moodType: getNameAndColorForMood(details[clickedIndex].mood_type).moodType, // 기쁨 또는 행복
                    percentage: details[clickedIndex].percentage // %
                });
            }
        }
    }), [details, selectedMood]);

    return (
        <div className={"mood-results"}>
            {/* 감정 점수 */}
            <div className="mood-score">
                <p>{scoreToComment(mood_score)}</p> {/* 점수를 코멘트로 변경 출력 */}
            </div>

            {/* 세부 감정 그래프 */}
            <div className="mood-details">
                <div className="doughnut-chart" style={{ position: 'relative' }}>
                    <Doughnut data={chartData} options={chartOptions} plugins={[centerPercentagePlugin]} />
                </div>

                {selectedMood && (
                    <div className="selected-mood-info">
                        <p>{selectedMood.moodType}</p>
                    </div>
                )}
            </div>

            <MoodTags tags={tags} />
        </div>
    );
}

// ====== 차트 스타일 조정 =========
const chartStyle = {
    //chart
    chartBorderWidth : 2,
    chartBorderColor: '#fff',
    chartHoverOffset: 24,
    chartHoverBorderWidth: 3,

    //percentage
    perTextAlign : 'center',
    perTextBaseline : 'middle',
    perFont : 'bold 45px sans-serif', // 퍼센트 숫자 크기, 폰트

    //animation
    animateDuration: 2200,
    animateEasing: 'easeInOutQuart',
    animateRotate: true,// 회전 애니메이션

    //canvas
    canvasResponsive: true,// 상위 component에 크기를 맞춤(비율x)
    canvasMaintainAspectRatio: false, // 상위 component의 비율에 맞춤
    canvasPadding : 13,

    // label
    joy : '기쁨 | 행복',
    anger : '분노 | 짜증',
    anxiety : '불안 | 걱정',
    sadness : '슬픔 | 우울',
    boredom : '지루 | 권태',
    comfort : '평온 | 만족',
    etc : '중립 | 기타',

    // color
    joyColor : '#fbc02d',
    angerColor : '#e53935',
    anxietyColor : '#8e24aa',
    sadnessColor : '#1e88e5',
    boredomColor : '#90a4ae',
    comfortColor : '#43a047',
    etcColor : '#ee3',

    // hover borderColor
    joyHBC : '#fbc02d',
    angerHBC : '#e53935',
    anxietyHBC : '#8e24aa',
    sadnessHBC : '#1e88e5',
    boredomHBC : '#90a4ae',
    comfortHBC : '#43a047',
    etcHBC : '#ee3',
}


// ==== 보조 함수 ====
// 감정에 따른 이름 및 색상 맵핑 함수
const getNameAndColorForMood = (label) => {
    switch (label) {
        case '기쁨/행복': return {moodType : chartStyle.joy, color:chartStyle.joyColor, hoverBorderColor : chartStyle.joyHBC};
        case '분노/짜증': return {moodType : chartStyle.anger, color:chartStyle.angerColor, hoverBorderColor : chartStyle.angerHBC};
        case '불안/걱정': return {moodType : chartStyle.anxiety, color:chartStyle.anxietyColor, hoverBorderColor : chartStyle.anxietyHBC};
        case '슬픔/우울': return {moodType : chartStyle.sadness, color:chartStyle.sadnessColor, hoverBorderColor : chartStyle.sadnessHBC};
        case '지루/권태': return {moodType : chartStyle.boredom, color:chartStyle.boredomColor, hoverBorderColor : chartStyle.boredomHBC};
        case '평온/만족': return {moodType : chartStyle.comfort, color:chartStyle.comfortColor, hoverBorderColor : chartStyle.comfortHBC};
        default: return {moodType : chartStyle.etc, color:chartStyle.etcColor, hoverBorderColor : chartStyle.etcHBC};
    }
};

// 감정 점수에 따른 코멘트
const scoreToComment = (mood_score) => {

    if (mood_score >= 80 && mood_score <= 100) {
        return "마치 햇살이 바다를 황금빛으로 물들이는 것처럼 오늘 하루가 빛나네요! 🏄‍♀️✨"
    } else if (mood_score >= 50 && mood_score <= 79) {
        return "맑은 바다에서 수영하는 것처럼 즐거워 보여요 🏊‍♀️"
    } else if (mood_score >= 16 && mood_score <= 49) {
        return "잔잔한 파도처럼 마음도 평온해 보여요 나쁘지 않은 하루네요 🏖️"
    } else if (mood_score >= -15 && mood_score <= 15) {
        return "평온하지만 조금 흐린 바다 같은  기분이시군요 그런 날도 있죠 🌫️"
    } else if (mood_score >= -49 && mood_score <= -16) {
        return "조금 힘든 하루였나 봐요  때로는 파도가 거칠어도 괜찮아요 곧 잠잠해질 테니까 ️🌊"
    } else if (mood_score >= -79 && mood_score <= -50) {
        return "마음이 많이 무겁네요 폭풍 후의 바다처럼... 이런 날도 지나갈 거예요 🚶‍♀️"
    } else {
        return "많이 힘드셨겠어요 가장 깊은 바다 밑에서도  언젠가는 다시 수면으로  떠오르게 되어 있어요 ⚓"
    }
}

// 퍼센트 숫자 스타일 조정
const centerPercentagePlugin = {
    id: 'centerPercentage',
    afterDraw(chart) {
        const { ctx, width, height } = chart;
        const pluginCP = chart.options.plugins?.centerPercentage || {};
        const { label, percentage } = pluginCP;

        if (!label || percentage === undefined) return;

        const percentageColor = getNameAndColorForMood(label).color

        ctx.save();
        ctx.textAlign = chartStyle.perTextAlign;
        ctx.textBaseline = chartStyle.perTextBaseline;

        // 퍼센트 숫자 (큰 글씨, 중앙)
        ctx.font = chartStyle.perFont;
        ctx.fillStyle = percentageColor;
        ctx.fillText(`${percentage}`, width / 2, height / 2 + 5);
        ctx.restore();
    }
};
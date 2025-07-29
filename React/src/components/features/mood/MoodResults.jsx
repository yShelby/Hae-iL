import React, {useEffect, useMemo, useRef, useState} from 'react';
import './css/MoodResult.css'
import MoodTags from "@features/mood/MoodTags.jsx";
import {
    Chart as ChartJS,
    ArcElement,
    LinearScale
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement,LinearScale);
// ========================================================================================

export default function MoodResult({ result }) {
    // 결과 받아오기
    const { details, mood_score, tags } = result;

    // moodComment, tag fade in 애니메이션 넣기
    const [scoreTagFade, setScoreTagFade] = useState(false);

    // percentage 애니메이션 넣기
    const [selectedMood, setSelectedMood] = useState({}); // 클릭 시 해당 moodType과 percentage 불러오기
    const [displayPercent, setDisplayPercent] = useState(0); // 0에서 시작
    const isFirstAnimation = useRef(true); // 처음 애니메이션을 시작하는지 체크 (마운트 vs. 이후 그래프 클릭 시 숫자 카운팅의 체감 속도가 다른 것을 보정)

    // moodType fade in 애니메이션 넣기
    const [moodTypeFade, setMoodTypeFade] = useState(false);
    const [animationTrigger, setAnimationTrigger] = useState(0); // moodType 애니메이션 강제 트리거를 위한 카운터


    // ========================================================================================
    // === 초기 렌더링 시 가장 큰 퍼센트를 가진 moodType 호출 ===
    useEffect(() => {
        if (details && details.length > 0) {
            const maxItem = details.reduce((a, b) => (b.percentage > a.percentage ? b : a));
            setSelectedMood({
                label : maxItem.mood_type,
                moodType: getNameAndColorForMood(maxItem.mood_type).moodType,
                percentage: maxItem.percentage
            });
            console.log("디테일 : ",details)
        }
    }, [details]);


// 감정점수, 태그 애니메이션 useEffect
    useEffect(() => {
        // 무조건 fade-out(숨김)으로 시작
        setScoreTagFade(false);
        // 다음 프레임에 fade-in 부여
        const timer = requestAnimationFrame(() => setScoreTagFade(true));
        return () => cancelAnimationFrame(timer);
    }, [mood_score, tags]);

    // === percentage 애니메이션 ===
    useEffect(() => {
        if (!selectedMood || typeof selectedMood.percentage !== 'number') return;

        let animationFrame;
        const duration = animationValue.durRatio * selectedMood.percentage;
        const start = performance.now();

        // 최초엔 0, 이후에는 1/3에서 시작
        const startValue = isFirstAnimation.current ? 0 : Math.round(selectedMood.percentage / animationValue.startRatio);

        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.round(startValue + (selectedMood.percentage - startValue) * progress);

            setDisplayPercent(value);

            // 애니메이션 반복 여부
            if (progress < 1) { //만약 percentage보다 작은 숫자면 계속 진행
                animationFrame = requestAnimationFrame(animate);
            } else { // 그렇지 않으면 percentage에서 멈춤
                setDisplayPercent(selectedMood.percentage);
                isFirstAnimation.current = false; // 최초 애니메이션 끝내고 ref 업데이트
            }
        };

        animationFrame = requestAnimationFrame(animate); //최초 애니메이션 호출

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [selectedMood]);

    // moodType 애니메이션
    useEffect(() => {
        if (!selectedMood.moodType) return; // moodType이 없으면 실행하지 않음

        // 무조건 fade-out부터 시작
        setMoodTypeFade(false);
        // 다음 프레임에서 fade-in 시작
        const timer = requestAnimationFrame(() => {
            setMoodTypeFade(true);
        });

        return () => {
            cancelAnimationFrame(timer);
        };
    }, [selectedMood.moodType, animationTrigger]); // animationTrigger 추가


    // ========================================================================================
    // === Chart data ===
    const chartData = useMemo(() => ({
        labels: details.map(detail => getNameAndColorForMood(detail.mood_type).moodType),
        datasets: [{
            data: details.map(detail => detail.percentage),
            backgroundColor: details.map(detail => getNameAndColorForMood(detail.mood_type).color),
            borderWidth: chartStyle.chartBorderWidth,
            borderColor: chartStyle.chartBorderColor,
            hoverOffset: chartStyle.chartHoverOffset,
            hoverBorderWidth: chartStyle.chartHoverBorderWidth,
            hoverBorderColor: details.map(detail => getNameAndColorForMood(detail.mood_type).hoverBorderColor)
        }]
    }), [details]);

    // === Chart 옵션 ===
    const chartOptions = useMemo(() => ({
        // 애니메이션 효과
        animation: {
            duration: animationValue.animateDuration,
            easing: animationValue.animateEasing,
            animateRotate: animationValue.animateRotate,
        },
        layout : {
            padding: {
                top: chartStyle.canvasPadding,
                bottom: chartStyle.canvasPadding,
                left: chartStyle.canvasPadding,
                right: chartStyle.canvasPadding,
            }
        },
        plugins: {
            legend:false,
        },
        responsive: chartStyle.canvasResponsive,
        maintainAspectRatio: chartStyle.canvasMaintainAspectRatio,
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const clickedIndex = elements[0].index;
                setSelectedMood({
                    label : details[clickedIndex].mood_type, // 기쁨/행복
                    moodType: getNameAndColorForMood(details[clickedIndex].mood_type).moodType, // 기쁨 또는 행복
                    percentage: details[clickedIndex].percentage // %
                });
                // 같은 데이터를 클릭해도 moodType 애니메이션이 실행되도록 트리거 증가
                setAnimationTrigger(prev => prev + 1);
            }
        }
    }), [details]);
    // ========================================================================================

    return (
        <div className={"mood-results"}>
            <div className={"mood-wrapper"}>
                {/* 감정 점수 */}
                <div className={`mood-score${scoreTagFade ? ' fade-in' : ''}`}>
                    <p>{scoreToComment(mood_score)}</p> {/* 점수를 코멘트로 변경 출력 */}
                </div>

                {/* 세부 감정 그래프 */}
                <div className="mood-details">
                    <div className="doughnut-chart" style={{ position: 'relative' }}>
                        <Doughnut data={chartData} options={chartOptions} plugins={[centerPercentagePlugin]} />
                        <div className="percentage-box" style={{font: chartStyle.perFont, color: getNameAndColorForMood(selectedMood.label).color}}>
                            {displayPercent}
                        </div>
                    </div>

                    {selectedMood.moodType && ( /* moodType이 존재할 때만 렌더링 */
                        <div className={`selected-mood-info${moodTypeFade ? ' fade-in' : ''}`}>
                            <p>{selectedMood.moodType}</p>
                        </div>
                    )}
                </div>
            </div>
            <MoodTags tags={tags} scoreTagFade={scoreTagFade} />
        </div>
    );
}

// ========================================================================================
// === 차트 스타일 조정 ===
const chartStyle = {
    //chart
    chartBorderWidth : 2,
    chartBorderColor: '#fff',
    chartHoverOffset: 15,
    chartHoverBorderWidth: 3,

    //percentage number
    perFont : "bold 30px 'NPSfont'",

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
    joyColor : '#fbc4d6',
    angerColor : '#fa7373',
    anxietyColor : '#ceb2fa',
    sadnessColor : '#5e84ff',
    boredomColor : '#99bbcf',
    comfortColor : '#77d17b',
    etcColor : '#9a9a9a',

    // hover borderColor
    joyHBC : '#fbc4d6',
    angerHBC : '#fa7373',
    anxietyHBC : '#ceb2fa',
    sadnessHBC : '#5e84ff',
    boredomHBC : '#99bbcf',
    comfortHBC : '#77d17b',
    etcHBC : '#9a9a9a',
}

// === animation 조절 ===
const animationValue = {
    // percentage animation
    durRatio : 20,
    startRatio : 3,

    // chart animation
    animateDuration: 2200,
    animateEasing: 'easeInOutQuart',
    animateRotate: true,// 회전 애니메이션

}

// === 보조 함수 ===
// === 감정에 따른 이름 및 색상 맵핑 함수 ===
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

// === 퍼센트 스타일 함수 ===
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
        ctx.fillText(`${percentage}`, width / 2, height / 2 - 5);
        ctx.restore();
    }
};

// === 감정 점수에 따른 코멘트 ===
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
        return "조금 힘든 하루였나 봐요 때로는 파도가 거칠어도 괜찮아요 곧 잠잠해질 테니까 ️🌊"
    } else if (mood_score >= -79 && mood_score <= -50) {
        return "마음이 많이 무겁네요 폭풍 후의 바다처럼... 이런 날도 지나갈 거예요 🚶‍♀️"
    } else {
        return "많이 힘드셨겠어요 가장 깊은 바다 밑에서도 언젠가는 다시 수면으로 떠오르게 되어 있어요 ⚓"
    }
}


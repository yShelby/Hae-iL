import React, {useEffect, useRef} from 'react';
import WordCloud from 'wordcloud';

/**
 * wordcloud2.js를 사용하여 워드클라우드를 그리는 캔버스 컴포넌트
 * @param {object} props
 * @param {Array<[string, number]>} props.words - [단어, 가중치] 형태의 배열
 * @param {number} props.width - 캔버스 너비
 * @param {number} props.height - 캔버스 높이
 */
const WordCloudCanvas = ({words, width, height}) => {
    // 캔버스 DOM 요소에 접근하기 위한 ref
    const canvasRef = useRef(null);

    useEffect(() => {
        // 캔버스 ref가 유효하고, words 데이터가 있고, 그릴 수 있는 크기가 확보되었을 때만 실행
        if (canvasRef.current && words && words.length > 0 && width > 0 && height > 0) {

            // 프로젝트의 톤앤매너에 맞는 색상 팔레트 정의
            const colorPalette = ['#65B3B4', '#87C6B8', '#A8D8B9', '#4E9A9B', '#B2D5BA'];

            // 가중치를 폰트 크기에 명확하게 반영하기 위한 로직 추가
            const weights = words.map(word => word[1]);
            const maxWeight = Math.max(...weights);
            const minWeight = Math.min(...weights);
            const minFontSize = 12;
            const maxFontSize = Math.min(width / 8, height / 8, 60); // 동적 최대 폰트 크기
            // 컨테이너 너비의 1/8, 높이의 1/8, 그리고 고정값 40px 중에서 가장 작은 값을 최대 폰트 크기로 사용

            /* 가장 큰 텍스트를 중앙에 배치하기 위한 로직 추가
             * 1.(정렬) 먼저 모든 단어를 가중치 순으로 정렬
             * 2.(분리) 상위 20%의 중요한 단어(topWords)와 나머지 80%의 단어(otherWords)로 분리
             * 3.(섞기) 나머지 80%의 단어(otherWords)만 무작위로 셔플(Fisher-Yates shuffle 알고리즘 사용)
             * 4.(결합) 중요한 단어 목록 뒤에 섞인 나머지 단어 목록을 이어 붙여 최종 목록(finalList)을 만든다. */
            const sortedWords = words.slice().sort((a, b) => b[1] - a[1]);

            // 상위 20%를 중요한 단어로 간주(최소 5개는 보장)
            const splitIndex = Math.max(Math.ceil(sortedWords.length * 0.2), 5);
            const topWords = sortedWords.slice(0, splitIndex);
            const otherWords = sortedWords.slice(splitIndex);

            // Fisher-Yates shuffle 알고리즘으로 나머지 단어들을 셔플
            for (let i = otherWords.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [otherWords[i], otherWords[j]] = [otherWords[j], otherWords[i]];
            }

            const finalList = [...topWords, ...otherWords];

            // wordcloud2.js 옵션 설정
            const options = {
                // list: 단어와 가중치(크기)를 담는 배열. [[단어1, 크기1], [단어2, 크기2]] 형태
                list: sortedWords,

                // gridSize: 단어들 사이의 간격. 너비 앞 숫자가 클수록 간격이 넓어진다.
                // 컨테이너 너비에 비례하여 동적으로 조절
                gridSize: Math.round(15 * width / 1024),

                weightFactor: (size) => {
                    /// 가중치가 모두 동일할 경우, 중간 크기의 폰트를 반환
                    if (maxWeight === minWeight) {
                        return (minFontSize + maxFontSize) / 2;
                    }
                    // 가중치(size)를 폰트 크기 범위에 비례하게 계산
                    const fontSize = minFontSize + ((size - minWeight) /
                        (maxWeight - minWeight)) * (maxFontSize - minFontSize);
                    return fontSize;
                },

                // fontFamily: 사용할 폰트
                fontFamily: 'Pretendard, Arial, sans-serif',

                // 단색 또는 랜덤 색상 대신, 정의된 색상 팔레트 내에서 무작위로 색을 선택하도록 함수를 지정
                color: (word, weight) => colorPalette[Math.floor(Math.random() * colorPalette.length)],

                // backgroundColor: 캔버스 배경색. 부모 컴포넌트의 배경을 따르도록 투명하게 설정
                backgroundColor: 'transparent',

                // rotateRatio: 단어를 회전시킬 확률. 0.5는 50%의 단어를 회전시킨다
                rotateRatio: 0.5,

                // rotationSteps: 90도 회전을 몇 단계로 나눌지 결정. 2는 0도, 90도만 사용.
                rotationSteps: 2,

                // ellipticity: 타원형의 정도. 1에 가까울수록 원형, 값이 작을수록 납작한 타원형이 된다.
                // 1보다 큰 경우 위아래로 긴 타원형태로 된다
                ellipticity: 1.8,

                // drawOutOfBound: 단어가 캔버스 밖으로 나가는 것을 허용할지 여부.
                // false로 설정하여 단어가 잘리는 것을 "반드시" 방지
                drawOutOfBound: false,

                // shrinkToFit: 단어가 컨테이너에 맞지 않을 경우, 모든 단어의 크기를 축소하여 맞춘다.
                // 단어 잘림을 방지하는 데 도움이 된다.
                shrinkToFit: true,

                shuffle: false, // 단어 겹침 현상 완화
            };

            // 2. 렌더링 시도
            try {
                WordCloud(canvasRef.current, options);
            } catch (err) {
                console.error('❌ 워드클라우드 렌더링 오류:', err);
            }

            // // wordcloud2.js 실행
            // WordCloud(canvasRef.current, options);
        }
    }, [words, width, height]); // words나 컨테이너 크기가 변경될 때마다 다시 그린다

    return (
        <canvas
            key={words.toString()}
            ref={canvasRef} width={width} height={height}>
        </canvas>
    );
};

export default WordCloudCanvas;

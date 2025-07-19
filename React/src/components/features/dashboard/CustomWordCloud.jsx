import React, { useState, useEffect } from 'react';
import cloud from 'd3-cloud';

const CustomWordCloud = ({ words, width, height }) => {
    // d3-cloud가 계산을 마치면 여기에 결과(위치, 크기 등)가 저장된다.
    const [laidOutWords, setLaidOutWords] = useState([]);

    // 파도 아이콘 SVG의 <path> 태그에서 'd' 속성값을 그대로 사용
    const svgPathData = "M485.27,310.45C474.06,172.85,383.45,32.45,242.66,4.28,234.48,2.64,226.12,2.35,218.14,0h-52.7l-36.76,7.97c-28.96,8.43-65.67,29.96-86.42,52.06C25.66,77.72-.51,112.27,17.74,136.06c5.97,7.78,14.84,13.48,24.66,14.54,15.64,1.69,33.07-7.29,46.65-14.36,2.81-1.46,7.46-5.46,9.61-6.32,2.34-.94,1.56.95,1.83,1.8,7.31,22.89,24.45,27.33,46.5,20.8,10.28-3.04,13.74-9.61,22.57-13.87,37.08,43.16,14.47,120.11-20.66,157.94-2.22,2.39-14.25,13.86-16.2,14.44-5.06,1.51-14.48-.46-19.7-1.86-20.44-5.46-27.34-23.34-51.12-21.16-14.81,1.36-22.5,13.18-35.33,18.58-9.83,4.14-20.12,4.42-26.57,14.48v178.92h500v-176.47c-3.39-6.39-8.51-9.82-14.73-13.08Z";

    // d3-cloud 레이아웃 계산 로직
    useEffect(() => {
        // 렌더링에 필요한 값이 준비되지 않았으면 계산을 시작 x
        if (!words || !width || !height) return;

        const layoutSize = [500, 500];

        // 폰트 크기 계산 함수
        const calculateFontSize = (word) => Math.log2(word.value) * 5 + 5;

        // d3-cloud 레이아웃 생성 및 설정
        const layout = cloud()
            .size(layoutSize) // 전체 캔버스 크기
            .words(words.map(w => ({ ...w, size: calculateFontSize(w) }))) // 단어와 계산된 폰트 크기 전달
            .padding(10) // 단어 간 여백
            .rotate(() => (Math.random() > 0.5 ? 90 : 0)) // 50% 확률로 90도 회전
            .font('Noto Sans KR, Malgun Gothic, sans-serif')
            .fontSize(d => d.size)
            // 'end' 이벤트: 모든 단어의 위치 계산이 끝나면 호출된다.
            .on('end', words => {
                setLaidOutWords(words); // 계산 결과를 상태에 저장하여 렌더링을 트리거
            });

        // 레이아웃 계산 시작
        layout.start();

    }, [words, width, height]); // 의존성 배열: 이 값들이 바뀔 때마다 재계산

    // 순수 SVG를 이용한 렌더링
    // 캔버스가 아닌 SVG로 그리므로 getImageData 오류가 발생 x
    return (
        <svg width={width} height={height}
             viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
            <defs>
                {/* clipPath는 보이지 않는 마스크(틀)를 정의 */}
                <clipPath id="wordcloud-shape-mask">
                    {/* SVG Path 데이터를 여기에 넣어 틀의 모양을 결정 */}
                    <path d={svgPathData} />
                </clipPath>
            </defs>
            {/* 테두리를 보기 위한 로직 - 추후 제건 */}
            <path
                d={svgPathData}
                fill="none"
                stroke="#CBD5E1" // 테두리 색상 (더 연한 회색으로 변경)
                strokeWidth="2"
            />
            {/* 워드클라우드 전체를 <g> 태그로 감싸고 clipPath 속성을 적용
              이로써 워드클라우드는 clipPath에 정의된 모양대로 잘려서 보이게 된다.
            */}
            <g clipPath="url(#wordcloud-shape-mask)">
                {/* d3-cloud는 [0,0]을 중심으로 단어를 배치하므로,
                  전체 그룹을 캔버스 중앙으로 이동시켜 정중앙에 보이게 한다.
                */}
                <g transform={`translate(250, 250)`}>
                    {laidOutWords.map((word) => (
                        <text
                            key={word.text + word.value}
                            textAnchor="middle" // 텍스트 정렬 기준을 중앙으로
                            transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
                            style={{
                                fontSize: word.size,
                                fontFamily: 'Noto Sans KR, Malgun Gothic, sans-serif',
                                fill: word.sentiment === 'positive' ? '#3498DB' :
                                    word.sentiment === 'negative' ? '#E74C3C' : '#47e026',
                            }}
                        >
                            {word.text}
                        </text>
                    ))}
                </g>
            </g>
        </svg>
    );
};

export default CustomWordCloud;

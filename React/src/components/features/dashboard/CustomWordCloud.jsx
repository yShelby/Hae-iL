import React, { useState, useEffect } from 'react';
import cloud from 'd3-cloud';

/**
 * @typedef {object} WordData - 워드클라우드에 사용될 데이터 타입
 * @property {string} text - 표시될 단어
 * @property {number} value - 단어의 가중치 (폰트 크기 결정)
 * @property {string} sentiment - 감정 ('positive', 'negative', 'neutral')
 */

/**
 * d3-cloud를 직접 사용하여 만든 React 19 호환 워드클라우드 컴포넌트
 * @param {{
 * data: WordData[];
 * width: number;
 * height: number;
 * }} props
 */
const CustomWordCloud = (
    { data, width, height, fontFamily, padding, fontSizeMapper, sentimentColorizer, rotate,
    }) => {
    const [words, setWords] = useState([]);
    const [status, setStatus] = useState('initializing');

    // d3-cloud 라이브러리의 레이아웃 계산은 리소스 소모가 있을 수 있으므로,
    // data, width, height가 변경될 때만 실행되도록 useEffect를 사용.
    useEffect(() => {
        // 데이터가 없거나, 너비/높이가 유효하지 않으면 계산을 실행 x
        if (!data || data.length === 0 || !width || !height) {
            setWords([]);
            return;
        }

        // d3-cloud 계산이 시작되기 직전에 상태를 'processing'으로 변경합니다.
        setStatus('processing');

        // d3-cloud 레이아웃 설정
        const layout = cloud()
            .size([width, height])
            .words(data.map(d => ({ ...d }))) // 원본 데이터 복사
            .padding(padding)
            .rotate(rotate)
            .font(fontFamily)
            .fontSize(fontSizeMapper)
            .on('end', (calculatedWords) => {
                setWords(calculatedWords);
                // 계산이 모두 완료되면 상태를 'done'으로 변경하여
                // '생성 중...' 메시지를 사라지게 한다
                setStatus('done');
            });

        layout.start(); // 레이아웃 계산 시작

        // 컴포넌트가 언마운트되거나 재계산이 필요할 때, 진행 중이던 계산을 중지하여
        // 메모리 누수를 방지
        return () => {
            layout.stop();
        }

    }, [data, width, height, fontFamily, padding, fontSizeMapper, sentimentColorizer, rotate]);

    // SVG 내부에서 G(그룹) 태그를 사용하고 transform으로 중앙 정렬하면,
    // d3-cloud가 계산한 x, y 좌표를 그대로 사용하면서도 전체 클라우드를 쉽게 중앙에 배치 가능
    return (
        <div style={{ width, height, position: 'relative' }}>
            {status === 'processing' && (
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#6c757d'
                }}>
                    워드클라우드 생성 중...
                </div>
            )}
            <svg width={width} height={height}>
                <g transform={`translate(${width / 2},${height / 2})`}>
                    {words.map((word) => (
                        <text
                            key={word.text + word.value} // key는 고유해야 한다
                            textAnchor="middle"
                            transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
                            style={{
                                fontSize: word.size,
                                fontFamily: word.font,
                                fill: sentimentColorizer(word),
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease-out, fill 0.2s ease-out',
                            }}
                            // 추가 기능: 마우스 호버 시 단어 강조 효과
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = `translate(${word.x}, ${word.y}) rotate(${word.rotate}) scale(1.1)`;
                                e.currentTarget.style.fill = '#FF8C00'; // 강조 색상 (DarkOrange)
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = `translate(${word.x}, ${word.y}) rotate(${word.rotate}) scale(1)`;
                                e.currentTarget.style.fill = sentimentColorizer(word);
                            }}
                        >
                            {word.text}
                        </text>
                    ))}
                </g>
            </svg>
        </div>
    );
};

export default CustomWordCloud;

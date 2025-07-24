/* =================================================================
 * 📂 File: src/pages/diary/components/WeatherSelector.jsx
 * 📌 역할: 날씨를 선택하는 UI 컴포넌트입니다.
 * ✨ 기능: 상위 컴포넌트의 상태와 상태 변경 함수를 받아 제어되는 드롭다운 메뉴를 제공합니다.
 * ➡️ 데이터 흐름: (In) weather, setWeather props를 받음 → (Process) 사용자가 옵션을 변경하면 onChange 이벤트 발생 → (Out) setWeather 함수를 호출하여 상위 상태를 업데이트
 * ================================================================= */
import React from 'react';
import './css/WeatherSelector.css';

// 날씨와 이모지를 매핑하는 객체
const weatherEmojiMap = {
    '맑음': '☀️',
    '흐림': '☁️',
    '비': '🌧️',
    '눈': '❄️',
    '바람': '💨',
};

const WeatherSelector = ({ weather, setWeather }) => {
    // 1️⃣ 상위 컴포넌트로부터 현재 선택된 날씨(weather)와 상태 변경 함수(setWeather)를 props로 받음

    return (
        // <div className="weather-container">
        //     <div className="weather-selector">
        //         <label htmlFor="weather-select">오늘의 날씨:</label>
        //
        //         {/*
        //           2️⃣ 제어형 select 요소:
        //               - 현재 선택된 값(weather)을 value에 바인딩해 제어 컴포넌트로 동작
        //               - 사용자가 드롭다운에서 옵션 선택 시 onChange 이벤트 발생
        //               - onChange 핸들러에서 선택된 값을 setWeather 함수에 전달해 상위 상태를 업데이트
        //         */}
        //         <select
        //             id="weather-select"
        //             value={weather}
        //             onChange={(e) => setWeather(e.target.value)}
        //         >
        //             <option value="맑음">맑음</option>
        //             <option value="흐림">흐림</option>
        //             <option value="비">비</option>
        //             <option value="눈">눈</option>
        //             <option value="바람">바람</option>
        //         </select>
        //     </div>
        //

        // 기존에 label, select, indicator로 분리되어 있던 UI를 이모지와 select가 결합된 단일 형태로 통합
        <div className="weather-selector-container">
            <span className="weather-emoji">{weatherEmojiMap[weather]}</span>
            <select
                id="weather-select"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="weather-select"
            >
                <option value="맑음">맑음</option>
                <option value="흐림">흐림</option>
                <option value="비">비</option>
                <option value="눈">눈</option>
                <option value="바람">바람</option>
            </select>
        </div>
    );
};

export default WeatherSelector;

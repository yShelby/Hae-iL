/* =================================================================
 * 📂 File: src/widgets/gallery/FloatingActionButton.jsx
 * 📌 역할: 화면 우측 하단에 고정되어 특정 액션(갤러리 열기)을 수행하는 플로팅 버튼 UI입니다.
 * ✨ 기능: 클릭 시 부모로부터 전달받은 onClick 콜백 함수를 실행합니다.
 * ➡️ 데이터 흐름: (In) 부모로부터 onClick 핸들러를 받음 → (Out) 클릭 이벤트 발생 시 해당 핸들러 호출
 * ================================================================= */
import React from 'react';
import './css/Gallery.css';

const FloatingActionButton = ({ onClick }) => {
    return (
        <button className="fab" onClick={onClick}>
            +
        </button>
    );
};
export default FloatingActionButton;

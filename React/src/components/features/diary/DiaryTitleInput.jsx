/* =================================================================
 * 📂 File: src/pages/diary/components/DiaryTitleInput.jsx
 * 📌 역할: 일기 제목을 입력받는 input 필드를 제공하는 UI 컴포넌트입니다.
 * ✨ 기능: 상위 컴포넌트의 상태(state)와 상태 변경 함수(setter)를 받아 제어 컴포넌트로 동작합니다.
 * ➡️ 데이터 흐름: (In) title, setTitle props를 받음 → (Process) 사용자가 입력하면 onChange 이벤트 발생 → (Out) setTitle 함수를 호출하여 상위 컴포넌트의 상태를 업데이트
 * ================================================================= */
import React from 'react';
import './css/DiaryTitleInput.css';
import Input from "@shared/styles/Input.jsx";

const DiaryTitleInput = ({ title, setTitle }) => {
    // 1️⃣ 상위 컴포넌트에서 전달받은 현재 제목 값(title)을 input의 value로 설정 (제어 컴포넌트)
    // 2️⃣ 사용자가 입력 필드에 글자를 입력하면 onChange 이벤트 발생
    // 3️⃣ 이벤트 핸들러에서 e.target.value (입력된 문자열)를 setTitle 함수를 통해 상위 상태로 전달 → 상위 컴포넌트의 title 상태가 갱신됨
    return (
        <div className="input-group">
            <Input
                type="text"
                value={title} // 1. 현재 제목 값을 input에 바인딩
                onChange={(e) => setTitle(e.target.value)} // 2-3. 입력 변화 감지 및 상위 상태 업데이트
                placeholder="제목을 입력하세요" // 사용자 안내 텍스트
                // className="title-input" // CSS 클래스
                style={{ width: '100%', height: '40px', fontSize: '16px', color: 'var(--primary-color)' }}
            />
        </div>
    );
};

export default DiaryTitleInput;

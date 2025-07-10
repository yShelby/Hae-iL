/*
 * 📂 File: src/widgets/diary/DiaryEditor.jsx
 * 📌 역할: Tiptap 에디터의 UI와 툴바를 포함하는 위젯 컴포넌트입니다.
 * ✨ 기능: Bold, Italic 등 텍스트 서식과 이미지 업로드 버튼을 제공합니다. 이미지 업로드 로직은 부모로부터 전달받습니다.
 * ➡️ 데이터 흐름: (In) 부모로부터 editor 인스턴스와 onImageSelect 콜백을 받음 → (Process) 툴바 클릭 시 editor API 호출 또는 onImageSelect 콜백 실행
 */
import React, { useRef } from 'react';
import { EditorContent } from '@tiptap/react';
import './css/DiaryEditor.css';
import EditorToolbar from "@features/diary/EditorToolBar.jsx";

const DiaryEditor = ({ editor, onImageUpload }) => {
    // 1️⃣ 파일 선택 input 엘리먼트에 직접 접근하기 위한 ref 생성
    const fileInputRef = useRef(null);

    // 2️⃣ 툴바의 이미지 업로드 버튼이 클릭되면 호출되는 함수
    // - 숨겨진 파일 입력(input[type="file"])을 클릭시켜 파일 선택 창을 띄움
    const handleToolbarImageClick = () => {
        fileInputRef.current?.click();
    };

    // 3️⃣ 사용자가 파일 선택창에서 이미지를 고른 경우 실행되는 이벤트 핸들러
    // - 선택된 파일(첫번째)을 부모 컴포넌트가 넘겨준 onImageSelect 콜백에 전달 (업로드 X)
    // - input 값을 초기화해서 동일 파일 재선택 시에도 이벤트가 발생하도록 처리
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file && onImageUpload) {
            onImageUpload(file); // 실제 업로드는 저장 시점에!
        }
        if (event.target) {
            event.target.value = null;
        }
    };

    // 4️⃣ 컴포넌트 렌더링
    return (
        <div className="editor-container">
            {/* 툴바: 텍스트 서식 및 이미지 업로드 버튼 */}
            <EditorToolbar editor={editor} onImageClick={handleToolbarImageClick} />

            {/* 숨겨진 파일 선택 input (직접 UI에 노출하지 않고 JS로 조작) */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {/* 에디터 본문 */}
            <EditorContent editor={editor} className="tiptap-editor-content" />
        </div>
    );
};

export default DiaryEditor;

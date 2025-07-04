import React from 'react';
import {
    FaBold, FaItalic, FaUnderline, FaImage
} from 'react-icons/fa'; // 아이콘 라이브러리
import './css/EditorToolbar.css'; // 툴바 스타일

const EditorToolbar = ({ editor, onImageClick }) => {
    // 1️⃣ editor가 초기화되지 않았으면 아무것도 렌더링하지 않음
    if (!editor) return null;

    return (
        <div className="editor-toolbar">
            {/* 2️⃣ 굵게(Bold) 토글 버튼 - editor 명령 체인으로 bold 스타일 on/off */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
                title="굵게"
            >
                <FaBold />
            </button>

            {/* 3️⃣ 기울임(Italic) 토글 버튼 */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
                title="기울임"
            >
                <FaItalic />
            </button>

            {/* 4️⃣ 밑줄(Underline) 토글 버튼 */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'is-active' : ''}
                title="밑줄"
            >
                <FaUnderline />
            </button>

            {/* 5️⃣ 이미지 업로드 트리거 버튼 - 숨겨진 input[type="file"] 열기 */}
            <button
                type="button"
                onClick={onImageClick}
                title="이미지 업로드"
            >
                <FaImage />
            </button>

            {/* 6️⃣ 텍스트 색상 선택 input - 선택 시 editor에 색상 적용 */}
            <input
                type="color"
                className="color-input"
                onInput={(event) =>
                    editor.chain().focus().setColor(event.target.value).run()
                }
                value={editor.getAttributes('textStyle').color || '#000000'}
                title="글자 색"
            />

            {/* 7️⃣ 글꼴 변경 드롭다운 - 선택 시 editor에 font-family 적용 */}
            <select
                className="font-select"
                onChange={(event) =>
                    editor.chain().focus().setFontFamily(event.target.value).run()
                }
                value={editor.getAttributes('textStyle').fontFamily || ''}
                title="글꼴"
            >
                <option value="">기본 글꼴</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Courier New, monospace">Courier New</option>
                <option value="'Noto Sans KR', sans-serif">Noto Sans KR</option>
            </select>
        </div>
    );
};

export default EditorToolbar;
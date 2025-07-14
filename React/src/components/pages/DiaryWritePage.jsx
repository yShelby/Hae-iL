// 📄 파일 경로: src/pages/diary/DiaryWritePage.jsx
// 📌 역할:
// - ✍️ TipTap 기반 에디터를 통해 일기 작성/수정 UI 제공
// - ☁️ 이미지 업로드 및 S3 대기 처리
// - 🧠 기존 일기 데이터를 불러와 에디터에 렌더링
// - 🛠️ 일기 저장/삭제 기능 제공
// - 🔒 로그인 상태에 따라 접근 제어 및 알림 제공
// - 📆 선택된 날짜 기준으로 다이어리 로딩 및 표시 처리

import React, {useEffect, useState} from 'react';

// 📌 TipTap 확장 모듈 및 커스텀 에디터 확장
import {useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {Image as TipTapImage} from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';

// 📌 스타일 및 하위 컴포넌트
import './css/DiaryWritePage.css';
import {useDiaryForm} from '@/hooks/useDiaryForm.js';
import {useImageUpload} from '@/hooks/useImageUpload.js';
import {useDiaryMutations} from '@/hooks/useDiaryMutations.js';
import DiaryInfoBar from "@features/diary/DiaryInfoBar.jsx";
import DiaryTitleInput from "@features/diary/DiaryTitleInput.jsx";
import WeatherSelector from "@features/diary/WeatherSelector.jsx";
import DiaryEditor from "@features/diary/DiaryEditor.jsx";
import {ConfirmModal} from "@shared/UI/ConfirmModal.jsx";
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import {useAuth} from "@shared/context/AuthContext.jsx";
import {useQuestion} from "@shared/context/QuestionContext.jsx";
import QuestionDisplay from "@features/diary/QuestionDisplay.jsx";

// 🖼️ TipTap Image 확장을 block 요소로 커스터마이징
const CustomBlockImage = TipTapImage.extend({
    inline: false,
    group: 'block',
    draggable: true,
});

const DiaryWritePage = ({initialDiary, selectedDate, onActionSuccess, isLoading}) => {
    const {user} = useAuth();
    const checkLogin = useCheckLogin(); // 로그인 확인 훅
    const [isEditing, setIsEditing] = useState(false); // ✍️ 에디터 활성 여부

    // 추가 - 대시보드와 일기 페이지 간의 질문 상태를 동기화하고, 새로고침 시 두 페이지의 질문이 함께 변경되도록 하기 위해 추가
    const {question} = useQuestion();

    // 🧠 TipTap 에디터 초기화 및 확장 구성
    const editor = useEditor({
        extensions: [
            StarterKit,
            CustomBlockImage,
            Placeholder.configure({placeholder: '오늘 하루는 어떠셨나요?'}),
            Underline,
            TextStyle,
            Color,
            FontFamily,
        ],
        editorProps: {attributes: {class: 'tiptap-editor'}},
        editable: isEditing,
    });

    // 📄 제목/날씨 등 폼 상태 관리 훅
    const {diaryState, setField} = useDiaryForm(initialDiary);

    // ☁️ 이미지 업로드 훅 (에디터 연동 + S3 전송 준비)
    const {handleImageUpload, uploadPendingImagesToS3} = useImageUpload(editor);

    // 💾 저장/삭제 기능 + 모달 상태 관리 훅
    const {
        isSaving,
        handleSave,
        handleDelete,
        isConfirmOpen,
        confirmDelete,
        cancelDelete,
    } = useDiaryMutations({
        initialDiary,
        selectedDate,
        onActionSuccess,
        uploadPendingImagesToS3,
        diaryState,
        editor,
        user,
    });

    // 📥 [초기 데이터 세팅 + 로그인 확인] useEffect
    useEffect(() => {
        const hasContent = !!initialDiary;

        // 🚫 비로그인 상태에서 기존 일기 불러온 경우 → 편집 불가 + 내용 비움
        if (hasContent && !user) {
            setIsEditing(false);
            if (editor) {
                editor.setEditable(false);
                editor.commands.clearContent();
            }
            return;
        }

        // ✅ 로그인 상태일 경우: 기존 일기 있으면 편집 가능하게 세팅
        setIsEditing(hasContent);
        if (editor) {
            editor.setEditable(hasContent);
            const content = initialDiary?.content ? JSON.parse(initialDiary.content) : '';
            if (JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
                editor.commands.setContent(content, false);
            }
        }
    }, [initialDiary, editor, user]);

    // ✨ "작성하기" 버튼 클릭 시 → 에디터 활성화
    const handleStartWriting = () => {
        if (!checkLogin()) {
            return;
        }
        setIsEditing(true);
        if (editor) {
            editor.setEditable(true);
            editor.commands.focus();
        }
    };

    // ⏳ 일기 불러오는 중
    if (isLoading) {
        return (
            <div className="diary-write-page placeholder-wrapper">
                <p className="placeholder-text">일기를 불러오는 중입니다...</p>
            </div>
        );
    }

    // 📆 날짜 선택 안 된 경우 안내
    if (!selectedDate && !initialDiary) {
        return (
            <div className="diary-write-page placeholder-wrapper">
                <p className="placeholder-text">캘린더에서 날짜를 선택해주세요.</p>
            </div>
        );
    }

    return (
        <div className="diary-write-page">
            {/* 📌 상단 날짜 및 기존 작성 여부 표시 */}
            <DiaryInfoBar selectedDate={selectedDate} initialDiary={initialDiary}/>
            {/* 추가 - 날짜 아래 질문을 표시 */}
            <div className="diary-meta-container">
                <QuestionDisplay question={question}/>
            </div>

            {/* ✍️ 작성 전 안내 UI */}
            {!isEditing ? (

                <div className="placeholder-wrapper">
                    <p className="placeholder-text">오늘의 감정을 기록해보세요!</p>
                    <button onClick={handleStartWriting} className="start-writing-button">
                        작성하기
                    </button>
                </div>
            ) : (
                <>
                    {/* 📝 제목 입력 */}
                    <DiaryTitleInput
                        title={diaryState.title}
                        setTitle={(val) => setField('title', val)}
                    />

                    {/* 🌦️ 날씨 선택 */}
                    <WeatherSelector
                        weather={diaryState.weather}
                        setWeather={(val) => setField('weather', val)}
                    />

                    {/* ✍️ 본문 에디터 (이미지 포함) */}
                    <DiaryEditor editor={editor} onImageUpload={handleImageUpload}/>

                    {/* 💾 저장 / 🗑️ 삭제 버튼 */}
                    <div className="button-group">
                        {initialDiary?.diaryId ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="save-button"
                                    disabled={isSaving}
                                >
                                    {isSaving ? '수정 중...' : '수정'}
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="delete-button"
                                    disabled={isSaving}
                                >
                                    삭제
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="save-button"
                                disabled={isSaving}
                            >
                                {isSaving ? '저장 중...' : '저장'}
                            </button>
                        )}
                    </div>
                </>
            )}

            {/* 🧾 삭제 확인 모달 */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                message="정말 이 일기를 삭제하시겠습니까?"
                onConfirm={handleDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default DiaryWritePage;

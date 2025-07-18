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
import {useOutletContext} from "react-router-dom";
import {useAuth} from "@shared/context/AuthContext.jsx";
import {useQuestion} from "@shared/context/QuestionContext.jsx";
import QuestionDisplay from "@features/diary/QuestionDisplay.jsx";

// 🖼️ TipTap Image 확장을 block 요소로 커스터마이징
const CustomBlockImage = TipTapImage.extend({
    inline: false,
    group: 'block',
    draggable: true,
});

const DiaryWritePage = ({
                            initialDiary, selectedDate, isLoading,
                            onDiaryUpdated,
                            setSelectedDiaryId,
                            onEmotionUpdated
                        }) => {
    const {user} = useAuth();
    const checkLogin = useCheckLogin(); // 로그인 확인 훅
    const [isEditing, setIsEditing] = useState(false); // ✍️ 에디터 활성 여부

    // 추가 - 대시보드와 일기 페이지 간의 질문 상태를 동기화하고, 새로고침 시 두 페이지의 질문이 함께 변경되도록 하기 위해 추가
    const {question} = useQuestion();

    // const {
    //     // initialDiary, <- 위에서 이미 선언했기 때문에 주석 처리
    //     onDiaryUpdated, setSelectedDiaryId, onEmotionUpdated
    // } = useOutletContext();
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
    const {diaryState, setField, resetForm} = useDiaryForm(initialDiary);

    // ☁️ 이미지 업로드 훅 (에디터 연동 + S3 전송 준비)
    const {handleImageUpload, uploadPendingImagesToS3} = useImageUpload(editor);

    // const onActionSuccess = async (updatedDiaryOrNull) => {
    //     if (updatedDiaryOrNull) {
    //         setSelectedDiaryId?.(updatedDiaryOrNull.diaryId);  // 감정 분석 트리거
    //         onDiaryUpdated?.();  // 부모에게 다시 일기 불러오라고 요청
    //         onEmotionUpdated?.(); // 감정 분석 결과 새로고침
    //         setIsEditing(true);  // 저장 후에도 에디터 유지
    //     } else {
    //         setSelectedDiaryId?.(null);  // 삭제 시 감정 결과 초기화
    //         setIsEditing(false);
    //     }
    // };

    // 삭제 성공 시에도 onDiaryUpdated, onEmotionUpdated를 호출하여 부모 컴포넌트의 상태를
    // 즉시 동기화해야 데이터 정합성이 유지되고 사용자 경험(UX)이 개선된다
    const onActionSuccess = (updatedDiaryOrNull) => {
        if (updatedDiaryOrNull) { // 저장 또는 수정 성공 시
            setSelectedDiaryId?.(updatedDiaryOrNull.diaryId);
            onDiaryUpdated?.();
            onEmotionUpdated?.();
        } else { // 삭제 성공 시
            setSelectedDiaryId?.(null);
            onDiaryUpdated?.(); // 캘린더 등 목록 UI 갱신을 위해 호출
            onEmotionUpdated?.(); // 감정 분석 UI 갱신을 위해 호출
            setIsEditing(false); // 작성기 뷰를 닫고 초기 화면으로 전환
        }
    };

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

    // // 📥 [초기 데이터 세팅 + 로그인 확인] useEffect
    // useEffect(() => {
    //     const hasContent = !!initialDiary;
    //
    //     // 1. 에디터 내용 설정: initialDiary가 변경될 때마다 에디터 내용을 업데이트
    //     const content = initialDiary?.content ? JSON.parse(initialDiary.content) : '';
    //     if (JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
    //         editor.commands.setContent(content, false);
    //     }
    //
    //     // 🚫 비로그인 상태에서 기존 일기 불러온 경우 → 편집 불가 + 내용 비움
    //     if (hasContent && !user) {
    //         setIsEditing(false);
    //         if (editor) {
    //             editor.setEditable(false);
    //             editor.commands.clearContent();
    //         }
    //         return;
    //     }
    //
    //     // ✅ 로그인 상태일 경우: 기존 일기 있으면 편집 가능하게 세팅
    //     setIsEditing(hasContent);
    //     if (editor) {
    //         editor.setEditable(hasContent);
    //         const content = initialDiary?.content ? JSON.parse(initialDiary.content) : '';
    //         if (JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
    //             editor.commands.setContent(content, false);
    //         }
    //     }
    // }, [initialDiary, editor, user]);

    // [수정]
    // '뷰(View) 상태'와 '편집(Edit) 상태'를 명확히 분리하여 UX와 코드 안정성을 개선
    // 1. '읽기 전용' 모드 지원: 로그인하지 않아도 기존 일기 내용을 안전하게 보기 가능
    // 2. 로직 간소화: 중복 코드를 제거하고 조건부 로직을 명확하게 하여 유지보수성을 높인다
    useEffect(() => {
        if (!editor) return;

        const hasDiary = !!initialDiary;
        const content = hasDiary ? JSON.parse(initialDiary.content) : '';

        // 에디터 내용 동기화 (한 곳에서만 처리)
        if (JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
            editor.commands.setContent(content, false);
        }

        if (hasDiary) {
            // 기존 일기가 있으면 항상 '에디터 뷰'를 보여준다(isEditing = true)
            setIsEditing(true);
            // '편집 가능' 여부는 로그인 상태에 따라 결정(로그인 시에만 true)
            editor.setEditable(!!user);
        } else {
            // 기존 일기가 없으면 '작성하기' 뷰를 보여준다
            setIsEditing(false);
            // '작성하기' 버튼을 누르기 전까지는 편집 불가 상태를 유지
            editor.setEditable(false);
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

    // // 추가 - "닫기" 버튼 클릭 시 -> 에디터 비활성화
    // const handleCancelWriting = () => {
    //     setIsEditing(false);
    //     if (editor) {
    //         editor.setEditable(false);
    //         // 기존 일기가 있었다면, 그 내용으로 복원
    //         if (initialDiary) {
    //             const content = initialDiary.content ? JSON.parse(initialDiary.content) : '';
    //             editor.commands.setContent(content, false);
    //         } else { // 새 일기였다면 내용 비우기
    //             editor.commands.clearContent();
    //         }
    //     }
    // };

    // [수정]
    const handleCancelWriting = () => {
        // ✅ 수정
        setIsEditing(false); // 에디터 뷰를 닫는다
        resetForm(); // 폼(제목, 날씨) 상태를 초기값으로 리셋
        if (editor) {
            editor.commands.clearContent(); // 에디터 내용 비우기
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
                <div className={"diary-content-wrapper"}>
                    {/* 제목과 날씨 선택기를 감싸는 div 추가
                     -> 제목과 날씨를 가로로 나란히 배치하기 위해 flexbox를 적용할 부모 컨테이너가 필요 */}
                    <div className="title-weather-wrapper">
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
                    </div>
                    {/* ✍️ 본문 에디터 (이미지 포함) */}
                    <DiaryEditor editor={editor} onImageUpload={handleImageUpload}/>

                    {/* [수정] 실제 편집이 가능한 상태일 때만 저장/삭제/취소 버튼들을 보여준다. */}
                    {editor?.isEditable && (
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
                            {/* 추가 - 닫기 버튼 */}
                            <button
                                onClick={handleCancelWriting}
                                className="cancel-button"
                                disabled={isSaving}
                            >
                                닫기
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* 🧾 삭제 확인 모달 */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                message="정말 이 일기를 삭제하시겠습니까?"
                onConfirm={handleDelete}
                onClose={cancelDelete}
            />
        </div>
    );
};

export default DiaryWritePage;

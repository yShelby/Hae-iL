// 📄 파일 경로: src/pages/diary/DiaryWritePage.jsx
// 📌 역할:
// - ✍️ TipTap 기반 에디터를 통해 일기 작성/수정 UI 제공
// - ☁️ 이미지 업로드 및 S3 대기 처리
// - 🧠 기존 일기 데이터를 불러와 에디터에 렌더링
// - 🛠️ 일기 저장/삭제 기능 제공
// - 🔒 로그인 상태에 따라 접근 제어 및 알림 제공
// - 📆 선택된 날짜 기준으로 다이어리 로딩 및 표시 처리

import React, {useCallback, useEffect, useState} from 'react';

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
import useDiaryDraftStore from "@/stores/useDiaryDraftStore.js";

// 🖼️ TipTap Image 확장을 block 요소로 커스터마이징
const CustomBlockImage = TipTapImage.extend({
    inline: false,
    group: 'block',
    draggable: true,
});

const DiaryWritePage = () => {
    const {user} = useAuth();
    const checkLogin = useCheckLogin(); // 로그인 확인 훅
    const [isEditing, setIsEditing] = useState(false); // ✍️ 에디터 활성 여부

    // 추가 - 대시보드와 일기 페이지 간의 질문 상태를 동기화하고, 새로고침 시 두 페이지의 질문이 함께 변경되도록 하기 위해 추가
    const {question} = useQuestion();

    const {
        initialDiary,
        selectedDate,
        isLoading,
        onDiaryUpdated,
        setSelectedDiaryId,
        onEmotionUpdated,
        onDataChange,
        setSelectedDate,
    } = useOutletContext();

    // [추가] Zustand 스토어에서 임시 데이터 관련 상태와 함수를 가져온다.
    const {drafts, setDraft, clearDraft} = useDiaryDraftStore();
    // [추가] 현재 선택된 날짜에 해당하는 임시 데이터를 가져온다.
    const draft = drafts[selectedDate];

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
    // [추가] setDiaryState 추가로 받아온다.
    const {diaryState, setField, resetForm, setDiaryState} = useDiaryForm(initialDiary);

    // ☁️ 이미지 업로드 훅 (에디터 연동 + S3 전송 준비)
    const {handleImageUpload, uploadPendingImagesToS3} = useImageUpload(editor);

    // 삭제 성공 시에도 onDiaryUpdated, onEmotionUpdated를 호출하여 부모 컴포넌트의 상태를 즉시 동기화
    const onActionSuccess = (updatedDiaryOrNull) => {
        onDiaryUpdated?.(); // 캘린더 등 목록 UI 갱신을 위해 호출
        onEmotionUpdated?.(); // 감정 분석 UI 갱신을 위해 호출
        onDataChange?.(); // 선택된 날짜의 데이터 변경을 부모 컴포넌트에 알림
        if (updatedDiaryOrNull) { // 저장 또는 수정 성공 시
            setSelectedDiaryId?.(updatedDiaryOrNull.diaryId);
        } else { // 삭제 성공 시
            setSelectedDiaryId?.(null);
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

    // [수정] 기존 useEffect 로직을 임시 저장 기능에 맞게 통합하고 재구성
    useEffect(() => {
        // [수정] 새 작성 모드일 때, 임시 데이터(draft)가 있으면 우선적으로 사용
        if (!editor) return

        const hasDiary = !!(initialDiary && initialDiary.diaryId);
        const hasDraft = !!draft;
        const sourceData = hasDiary ? initialDiary : (hasDraft ? draft : null);
        if (sourceData) {
            // 1. 폼 상태(제목, 날씨) 설정
            setDiaryState((prev) => {
                if (
                    prev.title !== sourceData.title ||
                    prev.weather !== sourceData.weather
                ) {
                    return {
                        title: sourceData.title || '',
                        weather: sourceData.weather || '맑음',
                    };
                }
                return prev;
            });
            // 2. 에디터 내용 설정
            try {
                const contentToSet = sourceData.content ? (typeof sourceData.content === 'string'
                    ? JSON.parse(sourceData.content) : sourceData.content) : '';
                if (JSON.stringify(editor.getJSON()) !== JSON.stringify(contentToSet)) {
                    editor.commands.setContent(contentToSet, false);
                }
            } catch (e) {
                console.warn('Content JSON parse error:', e);
                editor.commands.clearContent();
            }
        } else {
            // 2. 데이터가 전혀 없는 경우 (완전 새 글)
            resetForm();
            editor.commands.clearContent();
        }

        // // 3. 편집 상태(isEditing) 및 편집 가능 여부(editable) 설정
        // if (hasDiary || draft) {
        //     setIsEditing(true);
        //     editor.setEditable(!!user);
        // } else {
        //     setIsEditing(false);
        //     editor.setEditable(false);
        // }

        // [수정]
        // 기존의 `if (hasDiary || draft)` 조건은 임시 저장된 글(draft)만 있어도
        // 자동으로 편집 모드로 진입시켜 "작성하기" 버튼을 건너뛰게 만들었다
        // 오직 데이터베이스에 '저장된' 일기(hasDiary)가 있을 경우에만 자동으로 편집 모드가 되도록 변경
        // 새 글을 작성하거나 임시 저장된 글이 있는 날짜를 선택했을 때 "작성하기" 버튼이 먼저 보인다
        if (hasDiary) {
            setIsEditing(true);
            editor.setEditable(!!user);
        } else {
            setIsEditing(false);
            editor.setEditable(false);
        }
    }, [initialDiary?.diaryId, editor, user, selectedDate]); // 의존성 추가

    // [추가] 사용자가 입력한 내용을 임시 저장하는 함수
    const saveDraft = useCallback(() => {
        // 수정 모드이거나 에디터가 준비되지 않았으면 임시 저장 x
        if (initialDiary || !editor) return;

        const draftData = {
            title: diaryState.title,
            weather: diaryState.weather,
            content: editor.getJSON(),
        };
        setDraft(selectedDate, draftData);
    }, [initialDiary, editor, diaryState, selectedDate, setDraft]);

    // [추가] 에디터 내용이 변경될 때마다 임시 저장 함수를 호출
    useEffect(() => {
        if (!editor || initialDiary) return; // 수정 모드에서는 임시 저장 x

        // 'update' 이벤트는 내용이 변경될 때마다 발생
        editor.on('update', saveDraft);
        return () => editor.off('update', saveDraft);
    }, [editor, initialDiary, saveDraft]);

    // [추가] 제목, 날씨가 변경될 때도 임시 저장
    useEffect(() => {
        if (!initialDiary) {
            saveDraft();
        }
    }, [diaryState.title, diaryState.weather, initialDiary, saveDraft]);

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

    // ✖️ "닫기" 버튼 클릭 시 → 에디터 비활성화 및 폼 초기화
    const handleCancelWriting = () => {
        // [추가] 새 글 작성 중에만 임시 데이터를 삭제
        if (!initialDiary) {
            clearDraft(selectedDate);
        }
        setIsEditing(false); // 에디터 뷰를 닫는다
        resetForm(); // 폼(제목, 날씨) 상태를 초기값으로 리셋
        if (editor) {
            // editor.commands.clearContent(); // 에디터 내용 비우기
            // [수정] 기존 일기가 있으면 그 내용으로 되돌리고, 없으면 비운다.
            const originalContent = initialDiary ? JSON.parse(initialDiary.content || '{}') : '';
            editor.commands.setContent(originalContent, false);
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
                {/* [수정] React error #185 방지를 위한 조건부 렌더링 */}
                {question && <QuestionDisplay question={question}/>}
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
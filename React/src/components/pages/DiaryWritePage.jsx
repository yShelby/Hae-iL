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
import Button from "@shared/styles/Button.jsx";
import {runPreloadInBackground} from "@features/recommend/runPreloadInBackground.js";

// 🖼️ TipTap Image 확장을 block 요소로 커스터마이징
const CustomBlockImage = TipTapImage.extend({
    inline: false,
    group: 'block',
    draggable: true,
});

const DiaryWritePage = () => {
    const {user} = useAuth();
    const checkLogin = useCheckLogin(); // 로그인 확인 훅

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
        editable: false,
    });

    // 📄 제목/날씨 등 폼 상태 관리 훅
    const {diaryState, setField} = useDiaryForm(initialDiary);

    // ☁️ 이미지 업로드 훅 (에디터 연동 + S3 전송 준비)
    const {handleImageUpload, uploadPendingImagesToS3} = useImageUpload(editor);

    // 성공 시 호출하여 부모 컴포넌트의 상태를 즉시 동기화
    const onActionSuccess = (updatedDiaryOrNull) => {
        onDiaryUpdated?.(); // 캘린더 등 목록 UI 갱신을 위해 호출
        onEmotionUpdated?.(); // 감정 분석 UI 갱신을 위해 호출
        runPreloadInBackground(false); // 추천 시스템을 위한 백그라운드 프리로드 실행
        onDataChange?.(); // 선택된 날짜의 데이터 변경을 부모 컴포넌트에 알림
        if (updatedDiaryOrNull) { // 저장 또는 수정 성공 시
            setSelectedDiaryId?.(updatedDiaryOrNull.diaryId);
            setDiaryMode('view');
            editor?.setEditable(false);
        } else { // 삭제 성공 시
            setSelectedDiaryId?.(null);
            setDiaryMode('empty');
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

    // diaryMode: 'empty' (작성 전, 삭제 시), 'view' (읽기 전용-저장 시), 'edit' (편집 모드)
    const [diaryMode, setDiaryMode] = useState(initialDiary ? 'view' : 'empty')

    useEffect(() => {
        if (!editor) return;
        // 초기 일기 데이터가 없으면 에디터를 비워둠
        const hasDiary = !!initialDiary;
        let content = '';

        // 초기 일기 내용이 JSON 형식으로 저장되어 있다고 가정하고 파싱
        try {
            content = hasDiary && initialDiary.content
                ? JSON.parse(initialDiary.content) : '';
        } catch (e) {
            console.warn('initialDiary.content JSON parse error:', e);
            content = '';
        }
        // 에디터 내용 동기화 (한 곳에서만 처리)
        if (JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
            editor.commands.setContent(content, false);
        }
        // 초기 일기 내용이 있다면 읽기 전용 모드로 설정
        if (hasDiary) {
            if (user) {
                setDiaryMode('view');         // 로그인 유저: 'view' 가능
                editor.setEditable(true);
            } else {
                setDiaryMode('empty');        // 비로그인 유저: 작성 안내만 보여줌
                editor.setEditable(false);
            }
        }
        // 새 일기 작성 전 상태로 초기화
        else {
            setDiaryMode('empty');
            editor.setEditable(false);
        }
    }, [initialDiary, editor, user]);

    // ✨ "작성하기" 버튼 클릭 시 → 에디터 활성화
    const handleStartWriting = () => {
        if (!checkLogin()) return;
        setDiaryMode('edit');
        if (editor) {
            editor.setEditable(true);
            editor.commands.focus();
        }
    };

    // ✖️ "닫기" 버튼 클릭 시 → 에디터 비활성화 및 폼 초기화
    const handleCancelWriting = () => {
        if (initialDiary) {
            // 기존 일기: 보기 모드로 전환
            setDiaryMode('view');
            editor?.commands.setContent(JSON.parse(initialDiary.content));
            editor?.setEditable(false);
        } else {
            // 새 일기: 작성 전 상태로
            setDiaryMode('empty');
            editor?.commands.clearContent();
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
            {/* 상단 날짜 및 기존 작성 여부 표시 */}
            <DiaryInfoBar selectedDate={selectedDate} initialDiary={initialDiary}/>
            {/* 날짜 아래 질문을 표시 */}
            <div className="diary-meta-container">
                {/* [수정] React error #185 방지를 위한 조건부 렌더링 */}
                {question && <QuestionDisplay question={question}/>}
            </div>

            {/* 작성 전 안내 UI */}
            {diaryMode === 'empty' && (
                <div className="placeholder-wrapper">
                    <p className="placeholder-text">오늘의 감정을 기록해보세요!</p>
                    <Button variant="button2"
                            onClick={handleStartWriting}
                            style={{width:'130px', fontSize:'16px'}}
                    >
                        작성하기
                    </Button>
                </div>
            )}

            {/* 일기 읽기 전용 모드 */}
            {diaryMode === 'view' && initialDiary && (
                <div className={"diary-view-wrapper"}>
                    <div className={"title-weather-wrapper"}>
                        <h3>{initialDiary.title}</h3>
                        <span>🌦 {initialDiary.weather || '날씨 없음'}</span>
                    </div>
                    <div className="diary-content">
                        {/* TipTap JSON을 HTML로 렌더링 */}
                        <div className="diary-readonly-content"
                             dangerouslySetInnerHTML={{ __html: editor?.getHTML?.() || '' }}/>
                    </div>
                    <div className="button-group">
                        <Button variant="button2"
                                style={{width: '60px', height: '30px'}}
                                onClick={() => {
                                    setDiaryMode('edit');
                                    editor?.setEditable(true);}}>
                            수정
                        </Button>
                        <Button variant="button2" onClick={confirmDelete}
                                style={{width: '60px', height: '30px'}}>
                            삭제
                        </Button>
                    </div>
                </div>
            )}

            {/* 일기 작성/수정 모드 */}
            {diaryMode === 'edit' && (
                <div className={"diary-content-wrapper"}>
                    {/*  제목과 날씨를 가로로 나란히 배치하기 위해 flexbox를 적용할 부모 컨테이너가 필요 */}
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

                    <div className="button-group">
                        <Button
                            variant="button2"
                            onClick={handleSave}
                            // className="save-button"
                            disabled={isSaving}
                            style={{width: '60px', height: '30px'}}
                        >
                            {isSaving ? '저장 중...' : (initialDiary?.diaryId ? '저장' : '저장')}
                        </Button>
                        <Button
                            variant="button2"
                            onClick={handleCancelWriting}
                            // className="cancel-button"
                            disabled={isSaving}
                            style={{width: '60px', height: '30px'}}
                        >
                            닫기
                        </Button>
                    </div>
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
import React, {useState, useEffect, useCallback} from 'react';
import { JournalForm } from '@features/journal/JournalForm';
import { createJournal, getJournalById, updateJournal } from '@api/journalApi';
import { showToast } from '@shared/UI/Toast';
import "./css/JournalEditor.css"
import useJournalDraftStore from "@/stores/useJournalDraftStore.js";

const JournalEditor = ({ journalId, onSaveSuccess, onCancel }) => {
    const isEditMode = Boolean(journalId);
    // initialData는 Form에 내려줄 초기 데이터 역할만 수행
    const [initialData, setInitialData] = useState(null);
    const [isLoading, setIsLoading] = useState(isEditMode);
    // 중복 제출 방지를 위한 isSubmitting 상태는 Editor가 관리
    const [isSubmitting, setIsSubmitting] = useState(false);

    // [추가] 임시 저장을 위한 고유 키를 정의. 수정 모드일 때는 journalId, 새 작성일 때는 'new'를 사용
    const draftKey = journalId || 'new';
    // [추가] 스토어에서 clearDraft 함수를 가져온다.
    const { clearDraft } = useJournalDraftStore();

    // 편집 모드일 경우, journalId를 기반으로 기존 데이터를 불러와 초기값으로 설정
    // 새 작성 모드일 경우 기본값을 세팅
    useEffect(() => {
        if (isEditMode) {
            setIsLoading(true);
            getJournalById(journalId)
                .then(data => {
                    setInitialData(data); // Form으로 전달할 초기 데이터 설정
                })
                .catch(() => {
                    showToast.error('데이터를 불러오는 데 실패했습니다.');
                    onCancel(); // 불러오기 실패 시 에디터 닫기
                })
                .finally(() => setIsLoading(false));
        } else {
            // 새 작성 모드에서는 initialData를 null로 설정하여 JournalForm이 임시 데이터를 사용하도록 유도
            // setInitialData({
            //     title: '',
            //     content: '',
            //     rating: 2.5, // 기본 별점 설정
            //     journalDate: new Date().toISOString().split('T')[0], // 오늘 날짜
            // });
        }
    }, [journalId, isEditMode, onCancel]);

    // Form으로부터 제출된 데이터를 받아, 작성/수정 API 호출 및 상태 관리
    const handleSubmit = async (formData) => {
        setIsSubmitting(true); // 중복 제출 방지 플래그 설정

        const apiCall = isEditMode
            ? () => updateJournal(journalId, formData)
            : () => createJournal(formData);

        try {
            const response = await apiCall();
            // 수정 - API 응답에서 ID만 추출하는 대신, 응답으로 받은 저널 객체 전체를 onSaveSuccess 콜백으로 전달
            // 이렇게 하면 부모 컴포넌트가 이 데이터를 바로 Viewer에게 넘겨줄 수 있습니다.
            onSaveSuccess(response); // 저널 객체 전체를 전달
            showToast.success(`저널이 성공적으로 ${isEditMode ? '수정' : '등록'}되었습니다.`);
            clearDraft(draftKey); // [추가] 저장 성공 시 임시 데이터를 삭제
        } catch (error) {
            showToast.error(`저장 중 오류가 발생했습니다.`);
        } finally {
            setIsSubmitting(false); // 제출 완료 후 플래그 해제
        }
    };

    // [추가] 닫기 버튼 클릭 시 임시 데이터를 삭제하고 부모의 onCancel 함수를 호출하는 핸들러
    const handleCancel = useCallback(() => {
        clearDraft(draftKey); // 임시 데이터 삭제
        onCancel(); // 부모 컴포넌트의 닫기 로직 실행
    }, [draftKey, clearDraft, onCancel]);


    // 데이터 로딩 중일 때 로딩 메시지 출력
    if (isLoading) {
        return <div className="status-message">수정할 내용을 불러오는 중...</div>;
    }

    // Form 컴포넌트 렌더링, 초기값과 제출 상태 등 props 전달
    return (
        <div className="journal-editor-container">
            <h2 className="editor-title">{isEditMode ? '저널 수정' : '새 저널 작성'}</h2>
            <JournalForm
                // key={journalId || 'new-journal'} // journalId 변경 시 Form 강제 리셋용 key
                key={draftKey} // [수정] key를 draftKey로 변경
                onSubmit={handleSubmit}
                // onCancel={onCancel}
                onCancel={handleCancel} // [수정] 임시 데이터를 삭제하는 핸들러로 교체
                initialData={initialData}
                isSubmitting={isSubmitting} // Form의 버튼 상태를 제어하기 위해 전달
                draftKey={draftKey} // [추가] Form이 임시 데이터를 찾을 수 있도록 draftKey 전달
            />
        </div>
    );
};

export default JournalEditor;

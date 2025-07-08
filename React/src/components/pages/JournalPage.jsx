import React, {useState} from 'react';
import {Button} from '../shared/UI/Button';
import {JournalList} from "@features/journal/JournalList.jsx";
import JournalEditor from "@features/journal/JournalEditor.jsx";
import {FilterByCategory} from "@features/journal/FilterByCategory.jsx";
import {useAuth} from "@features/auth/AuthContext.jsx";
import {showToast} from "@shared/UI/Toast.jsx";
import {deleteJournal} from "@api/journalApi.js";
import {ConfirmModal} from "@shared/UI/ConfirmModal.jsx";
import {JournalViewer} from "@features/journal/JournalViewer.jsx";
import "./css/JournalPage.css"

const JournalPage = () => {
    // UI 상태를 관리하는 viewMode 상태. mode: 'list'|'create'|'edit', journalId: 수정할 저널의 ID
    const [viewMode, setViewMode] = useState({mode: 'list', journalId: null});

    const [refreshKey, setRefreshKey] = useState(0); // 목록을 새로고침(즉시 반영)하기 위한 key 상태

    const [selectedCategory, setSelectedCategory] = useState('all'); // 필터 카테고리 선택 상태 추가

    const {user} = useAuth(); // 현재 로그인된 사용자 정보 가져오기

    const [isModalOpen, setIsModalOpen] = useState(false); // 삭제 확인 모달 관련 상태

    // ✅ 저널 아이템을 클릭했을 때 실행되는 함수 (상세보기로 전환)
    const handleItemSelect = (journalId) => {
        if (!user) {
            showToast.error("로그인을 해주세요.");
            return;
        }
        setViewMode({mode: 'view', journalId});
    };

    // ✅ 상세보기에서 수정 버튼 클릭 시 실행되는 함수
    const handleSwitchToEdit = () => {
        setViewMode(prev => ({...prev, mode: 'edit'}));
    };

    // ✅ "작성하기" 버튼 클릭 시 실행되는 함수
    const handleCreate = () => {
        if (!user) {
            showToast.error("로그인을 해주세요.");
            return;
        }
        setViewMode({mode: 'create', journalId: null});
    };

    // ✅ 에디터에서 "닫기" 클릭 시 실행 (모드에 따라 다르게 전환)
    const handleCancel = () => {
        if (viewMode.mode === 'edit') {
            setViewMode(prev => ({ ...prev, mode: 'view' }));
        } else {
            setViewMode({ mode: 'list', journalId: null });
        }
    };

    // ✅ 에디터에서 저장/수정 성공 후 처리
    const handleSuccess = (newJournalId) => {
        setRefreshKey(prevKey => prevKey + 1); // 목록 갱신 트리거

        // 작성 또는 수정 성공 후 해당 항목을 상세보기로 전환
        const newMode = viewMode.mode === 'create' || viewMode.mode === 'edit';
        if (newMode) {
            const journalToView = newJournalId || viewMode.journalId;
            setViewMode({ mode: 'view', journalId: journalToView });
        } else {
            // 삭제 시에는 목록으로 복귀
            setViewMode({ mode: 'list', journalId: null });
        }
    };

    // ✅ 삭제 요청 버튼 클릭 시 모달 오픈
    const handleDeleteRequest = () => {
        if (!user || !viewMode.journalId) {
            showToast.error("로그인을 해주세요.");
            return;
        }
        setIsModalOpen(true);
    };

    // ✅ 실제 삭제 확정 처리
    const handleDeleteConfirm = async () => {
        try {
            await deleteJournal(viewMode.journalId);
            showToast.success('삭제되었습니다.');
            setViewMode({ mode: 'list', journalId: null });
            setRefreshKey(prevKey => prevKey + 1); // 목록 갱신
        } catch (error) {
            showToast.error('삭제 중 오류가 발생했습니다.');
        } finally {
            setIsModalOpen(false);
        }
    };

    // ✅ 오른쪽 패널에 렌더링할 컴포넌트를 조건에 따라 반환
    const renderRightPanel = () => {
        switch (viewMode.mode) {
            case 'create':
                // ✍️ 새로운 저널을 작성하는 화면 (빈 폼)
                return <JournalEditor onSaveSuccess={handleSuccess} onCancel={handleCancel}/>;
            case 'edit':
                // ✏️ 기존 저널을 수정하는 화면 (초기값이 포함된 폼)
                return <JournalEditor journalId={viewMode.journalId} onSaveSuccess={handleSuccess}
                                      onCancel={handleCancel}/>;
            case 'view':
                // 🔍 저널 상세보기 화면 (수정 및 삭제 버튼 포함)
                return <JournalViewer journalId={viewMode.journalId} onEdit={handleSwitchToEdit}
                                      onDelete={handleDeleteRequest}/>;
            default:
                // 📋 기본 화면: 아무 저널도 선택되지 않았을 때
                return (
                    <div className="journal-placeholder">
                        <p>새로운 기록을 작성하거나<br/>목록에서 수정할 항목을 선택해주세요.</p>
                        <Button onClick={handleCreate} active>작성하기</Button>
                    </div>
                );
        }
    };

    return (
        <>
            <div className="journal-page-container two-column">
                {/* 왼쪽 패널: 저널 목록 */}
                <div className="left-panel">
                    <div className="panel-header">
                        <h1 className="panel-title">나의 저널 기록</h1>
                        <FilterByCategory
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                        />
                    </div>
                    <JournalList
                        key={refreshKey}
                        category={selectedCategory}
                        onItemSelect={handleItemSelect}
                        selectedJournalId={viewMode.journalId}
                        user={user}
                    />
                </div>
                {/* 오른쪽 패널: 상태에 따라 다른 내용 표시 */}
                <div className="right-panel">
                    {renderRightPanel()}
                </div>
            </div>
            {/* 삭제 확인 모달 */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                message="정말로 이 저널을 삭제하시겠습니까?"
            />
        </>
    );
};

export default JournalPage;

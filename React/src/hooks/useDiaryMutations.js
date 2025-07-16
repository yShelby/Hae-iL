// 📄 파일 경로: src/hooks/useDiaryMutations.js
// 📌 역할:
//   - 일기 생성(Create) / 수정(Update) / 삭제(Delete)을 처리하는 커스텀 훅
//   - 에디터 내용과 상태를 받아서 API에 전송하고, 결과에 따라 후속 처리 수행
//   - 이미지가 업로드 대기 중이면 S3 업로드도 함께 처리
//
// 📊 데이터 흐름도:
//   1️⃣ handleSave 호출 → editor 내용 가져오기
//   2️⃣ content에 포함된 이미지들 S3로 업로드 → URL로 치환
//   3️⃣ 저장 or 수정 API 호출 (기존 일기 유무에 따라 분기)
//   4️⃣ 성공 시 토스트 띄우고, 콜백으로 새 일기 상태 전달
//   5️⃣ handleDelete 호출 시 삭제 API 요청 → 콜백에 null 전달 후 홈으로 이동

import {useOutletContext} from 'react-router-dom';
import {useState, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {showToast} from "@shared/UI/Toast.jsx";
import {deleteDiaryAPI, saveDiaryAPI, updateDiaryAPI} from "@api/diaryApi.js";

export const useDiaryMutations = ({
                                      initialDiary,               // ✏️ 기존 일기 데이터 (있으면 수정, 없으면 신규 생성)
                                      selectedDate,               // 📅 선택된 일기 날짜
                                      onActionSuccess,            // ✅ 저장/삭제 후 콜백 (일기 갱신용)
                                      uploadPendingImagesToS3,    // ☁️ Blob → S3 업로드 함수
                                      diaryState,                 // ✍️ 제목 등 기타 상태
                                      editor,                     // 🖋️ TipTap 에디터 인스턴스
                                      user,                       // 🙋 로그인 유저 정보
                                  }) => {
    // const navigate = useNavigate();

    // ⏳ 저장 중 여부 상태
    const [isSaving, setIsSaving] = useState(false);

    // ❗ 삭제 확인 모달 상태
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const { onDataChange } = useOutletContext();
    // 💾 일기 저장 or 수정 핸들러
    const handleSave = useCallback(async () => {
        // 🚨 저장 조건 검사: 에디터/로그인 여부/중복 저장 방지
        if (!editor || isSaving || !user) {
            if (!user) showToast.error('로그인이 필요합니다.');
            return;
        }

        setIsSaving(true); // 🔄 저장 중으로 표시
        const toastId = showToast.loading('일기를 저장 중입니다...'); // ⏳ 토스트 표시

        try {
            // 🧠 에디터에서 JSON 포맷으로 내용 추출
            let contentJson = editor.isEmpty ? '' : editor.getJSON();

            // ☁️ 이미지가 있으면 S3에 업로드 → blob URL → 실제 URL로 교체
            if (contentJson) {
                contentJson = await uploadPendingImagesToS3(contentJson);
            }

            // 📦 최종 저장할 DTO 구성
            const dto = {
                ...diaryState,
                content: JSON.stringify(contentJson),
                diaryDate: selectedDate,
                userId: user.id,
            };

            // 🔄 수정 모드인 경우: update API 호출
            if (initialDiary?.diaryId) {
                const {data: updatedDiary} = await updateDiaryAPI(initialDiary.diaryId, dto);
                showToast.success('일기가 성공적으로 수정되었습니다.', {id: toastId});

                if (onActionSuccess) {
                    onActionSuccess(updatedDiary); // 🔁 수정 결과 반영
                }
            } else {
                // 🆕 신규 저장인 경우: save API 호출
                const {data: newDiary} = await saveDiaryAPI(dto);
                showToast.success('일기가 성공적으로 저장되었습니다.', {id: toastId});
                onDataChange?.(); // 타임라인 갱신 콜백 호출
                if (onActionSuccess) {
                    onActionSuccess(newDiary); // 🔁 새 일기 결과 반영
                }
            }
        } catch (error) {
            console.error(error);
            showToast.error(error.response?.data?.message || '저장에 실패했습니다.', {id: toastId});
        } finally {
            setIsSaving(false); // ✅ 저장 종료
        }
    }, [
        editor,
        isSaving,
        user,
        uploadPendingImagesToS3,
        diaryState,
        selectedDate,
        initialDiary,
        onActionSuccess,
    ]);

    // 🗑️ 일기 삭제 핸들러
    const handleDelete = useCallback(async () => {
        if (!initialDiary?.diaryId) return;

        setIsConfirmOpen(false); // ❌ 삭제 모달 닫기
        const toastId = showToast.loading('일기를 삭제하는 중입니다...');

        try {
            await deleteDiaryAPI(initialDiary.diaryId); // 📡 삭제 API 호출
            showToast.success('일기가 삭제되었습니다.', {id: toastId});

            if (onActionSuccess) {
                onActionSuccess(null); // ⛔ 삭제되었으므로 null 전달
            }

            // navigate('/'); // 🏠 홈으로 이동
        } catch (error) {
            showToast.error(error.response?.data?.message || '삭제에 실패했습니다.', {id: toastId});
        }
    }, [initialDiary, onActionSuccess,
        // navigate
    ]);

    // 🟨 삭제 확인 모달 열기
    const confirmDelete = () => setIsConfirmOpen(true);

    // ⛔ 삭제 취소 (모달 닫기)
    const cancelDelete = () => setIsConfirmOpen(false);

    // 🚚 외부로 내보내는 항목들
    return {
        isSaving,        // ⏳ 저장 중 여부
        handleSave,      // 💾 저장 or 수정 실행
        handleDelete,    // 🗑️ 삭제 실행
        isConfirmOpen,   // ❗ 삭제 확인 모달 상태
        confirmDelete,   // ✅ 삭제 확인 클릭
        cancelDelete,    // ❌ 삭제 취소 클릭
    };
};

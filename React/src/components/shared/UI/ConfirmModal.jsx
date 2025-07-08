/**
 * 📁 File: src/shared/ui/ConfirmModal.jsx
 * 📌 역할: 사용자에게 중요한 작업(예: ❌삭제, ✔확인)을 수행하기 전에
 *          한 번 더 재확인을 받기 위한 **모달 UI 컴포넌트**
 *
 * ✅ 기능 요약:
 * - `isOpen` 여부에 따라 모달 표시/숨김
 * - `onConfirm`, `onCancel` 콜백 함수 실행
 * - 배경 클릭 시 모달 닫힘 처리 포함
 *
 * 🔄 데이터 흐름:
 * [부모 컴포넌트] → (props 전달) → ConfirmModal
 * isOpen, message, onConfirm, onCancel
 *
 * [ConfirmModal 내부]
 * - `isOpen === false` → null 반환으로 모달 미표시
 * - 배경 오버레이 클릭 → `onCancel` 실행
 * - 확인 버튼 클릭 → `onConfirm` 실행
 *
 * 📦 스타일: Modal.css(공용) + ConfirmModal.css(전용)
 */

import React from 'react';
import './css/Modal.css';          // 🧩 공용 모달 스타일 import
import './css/ConfirmModal.css';  // 🎨 ConfirmModal 전용 스타일 import

export const ConfirmModal = ({ isOpen, message, onConfirm, onClose }) => {
    // 🛑 1단계: 모달이 열려있지 않으면 아무것도 렌더링하지 않음
    if (!isOpen) return null;

    return (
        // 🌫️ 2단계: 배경 오버레이 영역 (클릭 시 모달 닫기 트리거)
        <div className="modal-overlay" onClick={onClose}>

            {/* 🧱 3단계: 모달 내용 - 클릭 버블링 막기 */}
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                {/* 💬 4단계: 메시지 출력 */}
                <p>{message}</p>

                {/* 🎮 5단계: 버튼 컨트롤 영역 */}
                <div className="modal-buttons">

                    {/* 🔙 취소 버튼 - onCancel 호출 */}
                    <button onClick={onClose} className="cancel-button">취소</button>

                    {/* ✅ 확인 버튼 - onConfirm 호출 */}
                    <button onClick={onConfirm} className="confirm-button">확인</button>
                </div>
            </div>
        </div>
    );
};
